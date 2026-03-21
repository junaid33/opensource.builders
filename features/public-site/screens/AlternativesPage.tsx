'use client';

import { useMemo, useState } from 'react';
import { useAlternatives } from '../lib/hooks';
import { Container, Spacer, PageHeader } from '../components/shared';
import { Footer } from '../components/landing/Footer';
import { DataTableDrawer } from '@/components/ui/DataTableDrawer';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, Star, Globe } from 'lucide-react';
import { CapabilityDropdownChip } from '../components/shared';
import ToolIcon from '@/components/ToolIcon';
import { useCapabilityActions, useSelectedCapabilities } from '@/hooks/use-capabilities-config';

function formatStars(n: number): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface AlternativesPageClientProps {
  slug: string;
}

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(orderBy: { name: asc }) {
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

// Color palette for capability dots
const CAP_COLORS = [
  '#8b5cf6', '#f472b6', '#22d3ee', '#ef4444', '#6366f1',
  '#f97316', '#a3e635', '#2dd4bf', '#4ade80', '#fbbf24',
  '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4',
];

export function AlternativesPageClient({ slug }: AlternativesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [showAllCaps, setShowAllCaps] = useState(false);
  const INITIAL_CAPS_LIMIT = 15;

  const { data: proprietaryApp, error: alternativesError } = useAlternatives(slug);

  const { data: apps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest<{ openSourceApplications: any[] }>(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const { addCapability, removeCapability } = useCapabilityActions();
  const selectedCapabilities = useSelectedCapabilities();

  const handleToggleCapability = (data: any) => {
    const isAlreadySelected = selectedCapabilities.some((c: any) => c.id === data.id);
    if (isAlreadySelected) {
      removeCapability(data.id);
    } else {
      addCapability(data);
    }
  };

  // Build capability color map
  const capColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    proprietaryApp?.capabilities?.forEach((cap, i) => {
      map[cap.slug] = CAP_COLORS[i % CAP_COLORS.length];
    });
    return map;
  }, [proprietaryApp]);

  // Filter capabilities based on search
  const visibleCaps = useMemo(() => {
    if (!proprietaryApp?.capabilities) return [];
    const q = searchValue.trim().toLowerCase();
    if (!q) return proprietaryApp.capabilities;
    return proprietaryApp.capabilities.filter(cap =>
      cap.name.toLowerCase().includes(q)
    );
  }, [proprietaryApp, searchValue]);

  // Filter alternatives based on selected capabilities
  const filteredAlternatives = useMemo(() => {
    if (!proprietaryApp?.openSourceAlternatives) return [];
    if (selectedCaps.length === 0) return proprietaryApp.openSourceAlternatives;

    return proprietaryApp.openSourceAlternatives.filter(alt =>
      alt.capabilities?.some(cap =>
        selectedCaps.includes(cap.capability.slug)
      )
    );
  }, [proprietaryApp, selectedCaps]);

  const toggleCap = (slug: string) => {
    setSelectedCaps(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  if (alternativesError || !proprietaryApp) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-red-500 mb-2">Failed to load alternatives</p>
          <p className="text-muted-foreground text-sm">
            {alternativesError?.message || 'Proprietary application not found'}
          </p>
        </div>
      </Container>
    );
  }

  const altCount = proprietaryApp.openSourceAlternatives?.length || 0;

  return (
    <Container>
      <PageHeader
        title={`Open Source Alternatives to ${proprietaryApp.name}`}
        subtitle={`Discover ${altCount} open source alternative${altCount !== 1 ? 's' : ''} to ${proprietaryApp.name}. Filter by capability to find the best fit.`}
      />

      <Spacer />

      {/* Browse section: Search + Capability chips + Alternatives list */}
      <section className="my-12">
        <h2 className="font-instrument-serif text-[1.3rem] mb-6">
          Filter by <i>Capability:</i>
        </h2>

        {/* Search + Chip filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search capabilities..."
            value={searchValue}
            onChange={e => setSearchValue(e.currentTarget.value)}
            className="h-9 w-[200px] px-3 text-sm bg-secondary border border-border text-foreground outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-muted"
          />

          {(searchValue || showAllCaps ? visibleCaps : visibleCaps.slice(0, INITIAL_CAPS_LIMIT)).map(cap => {
            const isActive = selectedCaps.includes(cap.slug);
            return (
              <button
                key={cap.slug}
                onClick={() => toggleCap(cap.slug)}
                className={cn(
                  'relative flex items-center gap-2 h-9 px-4 text-[0.79rem] font-medium cursor-pointer border transition-all duration-200',
                  isActive
                    ? 'text-foreground bg-accent border-border/60'
                    : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent',
                  'active:scale-95 rounded-none'
                )}
              >
                {isActive && (
                  <>
                    <span className="absolute top-[-1px] left-[-1px] w-[5px] h-[5px] border-l border-t border-foreground" />
                    <span className="absolute top-[-1px] right-[-1px] w-[5px] h-[5px] border-r border-t border-foreground" />
                    <span className="absolute bottom-[-1px] right-[-1px] w-[5px] h-[5px] border-r border-b border-foreground" />
                    <span className="absolute bottom-[-1px] left-[-1px] w-[5px] h-[5px] border-l border-b border-foreground" />
                  </>
                )}
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: capColorMap[cap.slug] || '#71717a' }}
                />
                <span>{cap.name}</span>
              </button>
            );
          })}

          {/* Show More toggle */}
          {!searchValue && visibleCaps.length > INITIAL_CAPS_LIMIT && (
            <button
              onClick={() => setShowAllCaps(!showAllCaps)}
              className="inline-flex h-9 items-center px-3 text-sm font-medium text-muted-foreground bg-secondary border border-transparent hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              {showAllCaps ? 'Show less' : `+ Show ${visibleCaps.length - INITIAL_CAPS_LIMIT} more`}
            </button>
          )}

          <button
            disabled={selectedCaps.length === 0 && !searchValue.trim()}
            onClick={() => { setSelectedCaps([]); setSearchValue(''); }}
            className="flex items-center h-9 px-4 text-[0.79rem] font-medium text-muted-foreground bg-secondary border border-border cursor-pointer transition-all duration-200 hover:text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
          >
            Clear All
          </button>
        </div>

        {/* Alternatives list */}
        {filteredAlternatives.length > 0 ? (
          <ul className="mt-9 list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
            {filteredAlternatives.map(alt => {
              const capCount = alt.capabilities?.length || 0;
              const isExpanded = expandedApp === alt.slug;

              return (
                <li key={alt.id} className="transition-opacity duration-200">
                  <div
                    className="flex items-center gap-2 py-1.5 cursor-pointer group"
                    onClick={() => setExpandedApp(isExpanded ? null : alt.slug)}
                  >
                    <ToolIcon
                      name={alt.name}
                      simpleIconSlug={alt.simpleIconSlug}
                      simpleIconColor={alt.simpleIconColor}
                      size={16}
                      rounded="none"
                      className="shrink-0"
                    />
                    <Link
                      href={`/os-alternatives/${alt.slug}`}
                      onClick={e => e.stopPropagation()}
                      className="font-medium text-foreground no-underline hover:underline shrink truncate"
                    >
                      {alt.name}
                    </Link>
                    {/* Dashed divider */}
                    <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />

                    {/* Stars & License */}
                    <div className="hidden shrink-0 items-center gap-2 truncate font-mono text-[0.75rem] uppercase text-zinc-600 dark:text-zinc-300 sm:flex">
                      {alt.repositoryUrl ? (
                        <a
                          href={alt.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                          <Star className="h-3.5 w-3.5" />
                          {formatStars(alt.githubStars)}
                        </a>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          {formatStars(alt.githubStars)}
                        </span>
                      )}
                      {alt.license && (
                        <>
                          <span>·</span>
                          <span>{alt.license}</span>
                        </>
                      )}
                      {alt.websiteUrl && (
                        <a
                          href={alt.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                          aria-label={`${alt.name} website`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="shrink-0 whitespace-nowrap font-mono text-[0.79rem] uppercase tabular-nums text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-50">
                      {capCount} {capCount === 1 ? 'feat' : 'feats'}
                    </p>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-200 dark:text-zinc-400',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>

                  {/* Accordion: Capabilities as Chips */}
                  {isExpanded && alt.capabilities && (
                    <div className="pl-5 pb-4 pt-2">
                      <div className="flex flex-wrap gap-2">
                        {alt.capabilities.map((cap: any) => {
                          const compositeId = `${alt.id}-${cap.capability.id}`;
                          const isSelected = selectedCapabilities.some((c: any) => c.id === compositeId);
                          return (
                            <CapabilityDropdownChip
                              key={cap.capability.id}
                              capability={cap.capability}
                              openSourceAppId={alt.id}
                              openSourceAppName={alt.name}
                              toolIcon={alt.simpleIconSlug || undefined}
                              toolColor={alt.simpleIconColor || undefined}
                              toolRepo={alt.repositoryUrl || undefined}
                              isSelected={isSelected}
                              onToggle={handleToggleCapability}
                              apps={apps}
                              isActive={cap.isActive !== false}
                              implementationNotes={cap.implementationNotes}
                              githubPath={cap.githubPath}
                              documentationUrl={cap.documentationUrl}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-9 text-sm text-muted-foreground">No alternatives found matching the selected capabilities.</p>
        )}
      </section>

      <Spacer />
      <Footer />

      <DataTableDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        apps={apps}
      />
    </Container>
  );
}
