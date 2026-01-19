'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query-keys';
import { fetchPaginatedAlternatives } from '../../lib/data';
import { DisplayCard } from '../alternatives/AlternativeCard';
import { ChevronLeft, ChevronRight, Plus, ArrowUpRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, type MotionStyle, type MotionValue, type Variants } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useCapabilityActions } from '@/hooks/use-capabilities-config';
import type { SelectedCapability } from '@/hooks/use-capabilities-config';
import { DataTableDrawer } from '@/components/ui/DataTableDrawer';
import { makeGraphQLRequest } from '../../lib/graphql/client';
import { useDebouncedSearch } from '../../lib/hooks/use-search';

// Types
type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface ProprietaryApp {
  name: string;
  slug: string;
}

// Default apps to show when not searching (featured/popular ones)
const DEFAULT_APP_SLUGS = [
  'shopify',
  'notion',
  'tailwind-plus',
  'screen-studio',
  'v0',
  'cursor',
  'figma',
  'slack',
  'zoom',
];

// Query to fetch all proprietary apps for search
const GET_ALL_PROPRIETARY_APPS = `
  query GetAllProprietaryApps {
    proprietaryApplications(orderBy: { name: asc }) {
      id
      name
      slug
    }
  }
`;

const ANIMATION_INTERVAL = 5000; // 5 seconds per step
const INITIAL_LOAD = 2; // Start with 2 cards
const LOAD_MORE_DESKTOP = 4; // Load 4 more on desktop (2x2 grid)
const LOAD_MORE_MOBILE = 2; // Load 2 more on mobile

// Animation presets
const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
} as const;

// Step variants for nav items
const stepVariants: Variants = {
  inactive: { scale: 0.95, opacity: 0.7 },
  active: { scale: 1, opacity: 1 },
};

// Hook for cycling through steps
function useStepCycler(totalSteps: number, interval: number, isPaused: boolean) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const timerId = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, interval);

    return () => clearTimeout(timerId);
  }, [currentStep, totalSteps, interval, isPaused]);

  const setStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex % totalSteps);
  }, [totalSteps]);

  return { currentStep, setStep };
}

// Hook for mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  return isMobile;
}

// Feature Card wrapper with mouse tracking
function FeatureCard({
  children,
  currentApp,
  onPrev,
  onNext
}: {
  children: React.ReactNode;
  currentApp: ProprietaryApp;
  onPrev: () => void;
  onNext: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="group relative w-full rounded-2xl"
      onMouseMove={handleMouseMove}
      style={{ "--x": useMotionTemplate`${mouseX}px`, "--y": useMotionTemplate`${mouseY}px` } as WrapperStyle}
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-card transition-colors duration-300">
        <div className="p-6 md:p-8">
          <div className="flex w-full items-start justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              {/* Static label - no animation */}
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Open Source Alternatives
              </div>
              {/* Only the title animates */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentApp.slug}
                  className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentApp.name}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Navigation arrows and link */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                href={`/alternatives/${currentApp.slug}`}
                className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                aria-label="View all alternatives"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// Navigation for switching between proprietary apps
function AppsNav({
  apps,
  allApps,
  current,
  onChange,
  onSelectApp
}: {
  apps: ProprietaryApp[];
  allApps: ProprietaryApp[];
  current: number;
  onChange: (index: number) => void;
  onSelectApp: (app: ProprietaryApp) => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Filter all apps based on search query
  const filteredApps = searchQuery.trim()
    ? allApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.slug.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 12) // Limit results
    : [];

  // Determine which apps to show: filtered results or default list
  const displayApps = searchQuery.trim() ? filteredApps : apps;
  const isFiltering = searchQuery.trim().length > 0;

  return (
    <nav aria-label="Alternatives" className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-center justify-center gap-2" role="list">
        {/* Search button/input */}
        <motion.li className="relative">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-input"
                initial={{ width: 36, opacity: 0 }}
                animate={{ width: 180, opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-1 rounded-full bg-muted border border-border overflow-hidden"
              >
                <Search className="w-4 h-4 ml-3 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="flex-1 bg-transparent text-sm py-1.5 pr-2 outline-none placeholder:text-muted-foreground min-w-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleClose();
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="search-button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                aria-label="Search for proprietary app"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.li>

        <AnimatePresence mode="popLayout">
          {displayApps.map((app, idx) => {
            const isCurrent = !isFiltering && current === idx;
            return (
              <motion.li
                key={app.slug}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                layout
                className="relative"
              >
                <button
                  type="button"
                  className={cn(
                    "group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                  onClick={() => {
                    if (isFiltering) {
                      onSelectApp(app);
                      handleClose();
                    } else {
                      onChange(idx);
                    }
                  }}
                >
                  <span className="hidden sm:inline-block">{app.name}</span>
                  <span className="sm:hidden">{app.name.split(' ')[0]}</span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>

        {isFiltering && filteredApps.length === 0 && (
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground py-1.5"
          >
            No apps found
          </motion.li>
        )}
      </ol>
    </nav>
  );
}

// Alternative cards content with pagination
function AlternativeCardsContent({
  currentSlug,
  currentApp,
  onOpenDrawer
}: {
  currentSlug: string;
  currentApp: ProprietaryApp;
  onOpenDrawer: () => void;
}) {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { addCapability } = useCapabilityActions();
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const [allAlternatives, setAllAlternatives] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset display count when app changes
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD);
    setAllAlternatives([]);
  }, [currentSlug]);

  // Fetch initial alternatives (first 2)
  const { data: initialData, isLoading } = useQuery({
    queryKey: [...queryKeys.proprietaryApps.alternatives(currentSlug), 'paginated', 0, INITIAL_LOAD],
    queryFn: () => fetchPaginatedAlternatives(currentSlug, INITIAL_LOAD, 0),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!currentSlug,
  });

  // Update allAlternatives when initial data loads
  useEffect(() => {
    if (initialData?.alternatives) {
      setAllAlternatives(initialData.alternatives);
    }
  }, [initialData]);

  const totalCount = initialData?.totalCount || 0;
  const proprietaryCapabilities = initialData?.capabilities || [];
  const remainingCount = totalCount - displayCount;
  const loadMoreCount = isMobile ? LOAD_MORE_MOBILE : LOAD_MORE_DESKTOP;
  const showMoreCount = Math.min(remainingCount, loadMoreCount);

  // Calculate capability compatibility for each alternative
  const getAlternativeCapabilities = (alternative: any) => {
    const altCapabilityIds = new Set(
      alternative.capabilities?.map((c: any) => c.capability.id) || []
    );

    // Get extra capabilities (OS has but proprietary doesn't)
    const proprietaryCapabilityIds = new Set(proprietaryCapabilities.map(c => c.id));
    const extraCapabilities = alternative.capabilities?.filter(
      (c: any) => !proprietaryCapabilityIds.has(c.capability.id)
    ).map((c: any) => ({
      id: c.capability.id,
      name: c.capability.name,
      slug: c.capability.slug,
      compatible: true,
      isExtra: true,
      category: c.capability.category,
      complexity: c.capability.complexity,
      implementationNotes: c.implementationNotes,
      githubPath: c.githubPath,
      documentationUrl: c.documentationUrl,
    })) || [];

    const matchingCapabilities = proprietaryCapabilities.map(cap => ({
      id: cap.id,
      name: cap.name,
      slug: cap.slug,
      compatible: altCapabilityIds.has(cap.id),
      isExtra: false,
      category: cap.category,
      complexity: cap.complexity,
    }));

    return [...matchingCapabilities, ...extraCapabilities];
  };

  // Handle capability click - add to build drawer
  const handleCapabilityClick = (capability: any, alternative: any) => {
    // Only allow clicking green (compatible) or blue (extra) capabilities
    if (capability.compatible === false) return;

    const selectedCapability: SelectedCapability = {
      id: `${alternative.id}-${capability.id}`,
      capabilityId: capability.id,
      toolId: alternative.id,
      name: capability.name,
      description: capability.description,
      category: capability.category,
      complexity: capability.complexity,
      toolName: alternative.name,
      toolIcon: alternative.simpleIconSlug,
      toolColor: alternative.simpleIconColor,
      toolRepo: alternative.repositoryUrl,
      implementationNotes: capability.implementationNotes,
      githubPath: capability.githubPath,
      documentationUrl: capability.documentationUrl,
    };

    addCapability(selectedCapability);
    onOpenDrawer();
  };

  // Load more alternatives
  const handleLoadMore = async () => {
    if (isLoadingMore || remainingCount <= 0) return;

    setIsLoadingMore(true);
    try {
      const nextSkip = allAlternatives.length;
      const nextTake = showMoreCount;

      const moreData = await fetchPaginatedAlternatives(currentSlug, nextTake, nextSkip);

      if (moreData.alternatives.length > 0) {
        setAllAlternatives(prev => [...prev, ...moreData.alternatives]);
        setDisplayCount(prev => prev + moreData.alternatives.length);
      }
    } catch (error) {
      console.error('Error loading more alternatives:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // No data yet - show minimal placeholder
  if (isLoading || !initialData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-background p-6 h-[280px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlug}
        className="space-y-4"
        {...ANIMATION_PRESETS.fadeInScale}
      >
        {/* Show alternative cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allAlternatives.map((alt, index) => {
            const capabilities = getAlternativeCapabilities(alt);
            const compatibleCount = capabilities.filter(c => c.compatible !== false && !c.isExtra).length;
            const extraCount = capabilities.filter(c => c.isExtra).length;
            const compatibilityScore = proprietaryCapabilities.length > 0
              ? Math.round((compatibleCount / proprietaryCapabilities.length) * 100)
              : 0;

            return (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % LOAD_MORE_DESKTOP) * 0.1, duration: 0.3 }}
                className="cursor-pointer transition-transform hover:scale-[1.02] h-full"
                onClick={(e) => {
                  // Don't navigate if clicking on a capability (which has its own handler)
                  if ((e.target as HTMLElement).closest('[data-capability]')) {
                    return;
                  }
                  window.location.href = `/os-alternatives/${alt.slug}`;
                }}
              >
                <DisplayCard
                  name={alt.name}
                  description={alt.description}
                  license={alt.license}
                  isOpenSource={true}
                  githubStars={alt.githubStars}
                  capabilities={capabilities}
                  repositoryUrl={alt.repositoryUrl}
                  websiteUrl={alt.websiteUrl}
                  simpleIconSlug={alt.simpleIconSlug}
                  simpleIconColor={alt.simpleIconColor}
                  totalCapabilities={proprietaryCapabilities.length}
                  compatibilityScore={compatibilityScore}
                  extraCapabilitiesCount={extraCount}
                  className="h-full"
                  onCapabilityClick={(capName) => {
                    const cap = capabilities.find(c => c.name === capName);
                    if (cap) {
                      handleCapabilityClick(cap, alt);
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Show more button - only show if there are more alternatives */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full",
                "text-base font-medium text-muted-foreground",
                "border border-border bg-background",
                "hover:bg-muted hover:text-foreground transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Show {showMoreCount} more alternative{showMoreCount !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      repositoryUrl
      websiteUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`;

// Main component
export default function HeroAlternatives() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ProprietaryApp | null>(null);

  // Fetch all proprietary apps for search
  const { data: allProprietaryApps = [] } = useQuery({
    queryKey: ['allProprietaryApps'],
    queryFn: async () => {
      const result = await makeGraphQLRequest<any>(GET_ALL_PROPRIETARY_APPS);
      return result.proprietaryApplications as ProprietaryApp[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Fetch all open source apps for the drawer
  const { data: apps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest<any>(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Build default apps list from fetched data, maintaining order from DEFAULT_APP_SLUGS
  const defaultApps = DEFAULT_APP_SLUGS
    .map(slug => allProprietaryApps.find(app => app.slug === slug))
    .filter((app): app is ProprietaryApp => app !== undefined);

  // Use defaultApps for cycling, but allow override when user selects from search
  const displayDefaultApps = defaultApps.length > 0 ? defaultApps : [{ name: 'Loading...', slug: '' }];

  const { currentStep, setStep } = useStepCycler(
    displayDefaultApps.length,
    ANIMATION_INTERVAL,
    isPaused || selectedApp !== null
  );

  // Current app is either the selected one from search, or the cycling default
  const currentApp = selectedApp || displayDefaultApps[currentStep] || { name: '', slug: '' };
  const currentSlug = currentApp.slug;

  // Typing animation synced with step changes
  useEffect(() => {
    // Reset typing when app changes
    setCurrentText('');
    setIsTyping(true);
    setIsDeleting(false);
  }, [currentApp.slug]);

  // Typing effect
  useEffect(() => {
    if (!currentApp.name) return;

    const currentWord = currentApp.name;
    const typingSpeed = 80;
    const erasingSpeed = 40;
    const pauseBeforeErase = 3000;

    // If paused, ensure we are typing back to the full word and NOT deleting
    if (isPaused) {
      if (currentText !== currentWord) {
        const timeout = setTimeout(() => {
          // Type back one character at a time or just snap? 
          // Typing back is smoother than snapping.
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            // If somehow longer, snap to it
            setCurrentText(currentWord);
          }
        }, typingSpeed);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else if (!selectedApp) {
          // Only auto-erase if not a manually selected app
          setTimeout(() => {
            setIsDeleting(true);
            setIsTyping(false);
          }, pauseBeforeErase);
        }
      } else if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Once fully deleted, we can't just stop here because useStepCycler
          // will change currentApp after ANIMATION_INTERVAL.
          // The typing effect will naturally restart when currentApp changes.
        }
      }
    }, isDeleting ? erasingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, isDeleting, currentApp.name, isPaused, selectedApp]);

  const handleTextClick = () => {
    if (currentSlug) {
      router.push(`/alternatives/${currentSlug}`);
    }
  };

  const handleStepChange = (index: number) => {
    setSelectedApp(null); // Clear any search selection
    setStep(index);
    setCurrentText('');
    setIsTyping(true);
    setIsDeleting(false);
  };

  const handleSelectApp = (app: ProprietaryApp) => {
    setSelectedApp(app);
    setCurrentText('');
    setIsTyping(true);
    setIsDeleting(false);
  };

  const handlePrev = () => {
    setSelectedApp(null);
    const prevIndex = (currentStep - 1 + displayDefaultApps.length) % displayDefaultApps.length;
    handleStepChange(prevIndex);
  };

  const handleNext = () => {
    setSelectedApp(null);
    const nextIndex = (currentStep + 1) % displayDefaultApps.length;
    handleStepChange(nextIndex);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Animated Text Header */}
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Find open source alternatives to
            <br />
            <span className="font-geist-sans font-semibold">
              <span
                className="inline-flex items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={handleTextClick}
              >
                {currentText}
                <span className="animate-pulse text-muted-foreground ml-1">|</span>
              </span>
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover powerful open source alternatives to popular proprietary software.
            <br className="hidden md:block" /> Take control of your software, gain freedom, and support the open source community.
          </p>
        </div>

        {/* Carousel Card */}
        <div
          className="flex flex-col gap-8 w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <FeatureCard
            currentApp={currentApp}
            onPrev={handlePrev}
            onNext={handleNext}
          >
            <AlternativeCardsContent
              currentSlug={currentSlug}
              currentApp={currentApp}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
          </FeatureCard>

          {/* Navigation tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AppsNav
              apps={displayDefaultApps}
              allApps={allProprietaryApps}
              current={selectedApp ? -1 : currentStep}
              onChange={handleStepChange}
              onSelectApp={handleSelectApp}
            />
          </motion.div>
        </div>
      </div>

      <DataTableDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        apps={apps}
      />
    </>
  );
}
