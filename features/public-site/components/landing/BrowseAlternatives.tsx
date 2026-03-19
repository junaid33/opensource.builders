'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { queryKeys } from '../../lib/query-keys';
import { makeGraphQLRequest } from '../../lib/graphql/client';
import { fetchAlternatives } from '../../lib/data';
import Link from 'next/link';
import { ChevronDown, Star } from 'lucide-react';
import { CapabilityDropdownChip } from '../shared';
import ToolIcon from '@/components/ToolIcon';
import { useCapabilityActions, useSelectedCapabilities } from '@/hooks/use-capabilities-config';

function formatStars(n: number): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Default featured proprietary apps to show as tag buttons
const DEFAULT_APP_SLUGS = [
  'shopify',
  'notion',
  'figma',
  'slack',
  'cursor',
  'zoom',
  'v0',
  'screen-studio',
  'tailwind-plus',
];

// Assign a color to each default app (matching desengs dot colors)
const APP_COLORS: Record<string, string> = {
  shopify: '#8b5cf6',
  notion: '#6366f1',
  figma: '#f472b6',
  slack: '#22d3ee',
  cursor: '#ef4444',
  zoom: '#f97316',
  v0: '#a3e635',
  'screen-studio': '#2dd4bf',
  'tailwind-plus': '#4ade80',
};

const GET_ALL_PROPRIETARY_APPS = `
  query GetAllProprietaryApps {
    proprietaryApplications(orderBy: { name: asc }) {
      id
      name
      slug
      slug
      simpleIconSlug
      simpleIconColor
    }
  }
`;

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(orderBy: { name: asc }) {
      id
      name
      slug
      simpleIconColor
      capabilities {
        capability { id name slug }
      }
    }
  }
`;

interface ProprietaryAppBasic {
  id: string;
  name: string;
  slug: string;
  simpleIconSlug?: string | null;
  simpleIconColor?: string | null;
}

function getAppColor(app: ProprietaryAppBasic): string {
  return APP_COLORS[app.slug] || app.simpleIconColor || '#71717a';
}

export function BrowseAlternatives() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(['shopify']);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // Fetch all proprietary apps for search
  const { data: allApps = [] } = useQuery<ProprietaryAppBasic[]>({
    queryKey: queryKeys.proprietaryApps.all,
    queryFn: async () => {
      const result = await makeGraphQLRequest<{ proprietaryApplications: ProprietaryAppBasic[] }>(GET_ALL_PROPRIETARY_APPS);
      return result.proprietaryApplications;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: openSourceApps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest<{ openSourceApplications: any[] }>(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { addCapability, removeCapability } = useCapabilityActions();
  const selectedCapabilities = useSelectedCapabilities();

  // Helper to toggle a capability via the dropdown
  const handleToggleCapability = (data: any) => {
    const isAlreadySelected = selectedCapabilities.some(c => c.id === data.id);
    if (isAlreadySelected) {
      removeCapability(data.id);
    } else {
      addCapability(data);
    }
  };

  // Build the default featured apps list
  const defaultApps = useMemo(() => {
    return DEFAULT_APP_SLUGS
      .map(slug => allApps.find(app => app.slug === slug))
      .filter((app): app is ProprietaryAppBasic => !!app);
  }, [allApps]);

  // Filter visible tag buttons based on search
  const visibleTags = useMemo(() => {
    if (!searchQuery.trim()) return defaultApps;
    const q = searchQuery.trim().toLowerCase();
    return allApps.filter(app =>
      app.name.toLowerCase().includes(q)
    );
  }, [allApps, defaultApps, searchQuery]);

  // Toggle a proprietary app filter - single selection only
  const toggleFilter = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? [] : [slug]
    );
  };

  const clearAll = () => {
    setSelectedSlugs([]);
    setSearchQuery('');
    setSearchValue('');
  };

  return (
    <section className="my-12">
      {/* Title */}
      <h2 className="font-instrument-serif text-[1.3rem] mb-6">
        Browse <i>Alternatives:</i>
      </h2>

      {/* Search + Tag Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Search Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            setSearchQuery(searchValue);
          }}
        >
          <input
            type="text"
            placeholder="Search here..."
            value={searchValue}
            onChange={e => {
              setSearchValue(e.currentTarget.value);
              // Live search for tags
              setSearchQuery(e.currentTarget.value);
            }}
            className="h-9 w-[200px] px-2 text-[0.79rem] bg-secondary border border-border text-foreground outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-muted"
          />
        </form>

        {/* Tag Buttons */}
        {visibleTags.map(app => {
          const isActive = selectedSlugs.includes(app.slug);
          return (
            <button
              key={app.slug}
              onClick={() => toggleFilter(app.slug)}
              className={cn(
                'relative flex items-center gap-2 h-9 px-4 text-[0.79rem] font-medium cursor-pointer border transition-all duration-200',
                isActive
                  ? 'text-foreground bg-accent border-border/60'
                  : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent',
                'active:scale-95 rounded-none'
              )}
            >
              {/* Corner brackets when active */}
              {isActive && (
                <>
                  <span className="absolute top-[-1px] left-[-1px] w-[5px] h-[5px] border-l border-t border-foreground" />
                  <span className="absolute top-[-1px] right-[-1px] w-[5px] h-[5px] border-r border-t border-foreground" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-[5px] h-[5px] border-r border-b border-foreground" />
                  <span className="absolute bottom-[-1px] left-[-1px] w-[5px] h-[5px] border-l border-b border-foreground" />
                </>
              )}
              {/* Color dot */}
              <ToolIcon
                name={app.name}
                simpleIconSlug={app.simpleIconSlug || undefined}
                simpleIconColor={getAppColor(app)}
                size={16}
                rounded="none"
                className="shrink-0"
              />
              <span>{app.name}</span>
            </button>
          );
        })}

        {/* Clear All */}
        <button
          disabled={selectedSlugs.length === 0 && !searchQuery.trim()}
          onClick={clearAll}
          className="flex items-center h-9 px-4 text-[0.79rem] font-medium text-muted-foreground bg-secondary border border-border cursor-pointer transition-all duration-200 hover:text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
        >
          Clear All
        </button>
      </div>

      {/* Alternatives List */}
      {selectedSlugs.length > 0 ? (
        <div className="mt-9">
          {selectedSlugs.map(slug => (
            <AlternativesList
              key={slug}
              slug={slug}
              allApps={allApps}
              expandedApp={expandedApp}
              onToggleExpand={setExpandedApp}
              selectedCapabilities={selectedCapabilities}
              onToggleCapability={handleToggleCapability}
              openSourceApps={openSourceApps}
            />
          ))}
        </div>
      ) : (
        <p className="mt-9 text-sm text-muted-foreground">
          Select a proprietary app above to see its open source alternatives.
        </p>
      )}
    </section>
  );
}

// ─── Sub-component: Fetches & renders alternatives for one proprietary app ───

interface AlternativesListProps {
  slug: string;
  allApps: ProprietaryAppBasic[];
  expandedApp: string | null;
  onToggleExpand: (slug: string | null) => void;
  selectedCapabilities: any[];
  onToggleCapability: (data: any) => void;
  openSourceApps: any[];
}

function AlternativesList({
  slug,
  allApps,
  expandedApp,
  onToggleExpand,
  selectedCapabilities,
  onToggleCapability,
  openSourceApps,
}: AlternativesListProps) {
  const { data: proprietaryApp, isLoading } = useQuery({
    queryKey: queryKeys.proprietaryApps.alternatives(slug),
    queryFn: () => fetchAlternatives(slug),
    staleTime: 5 * 60 * 1000,
  });

  const parentApp = allApps.find(a => a.slug === slug);
  const dotColor = parentApp ? getAppColor(parentApp) : '#71717a';

  if (isLoading) {
    return (
      <div className="py-2 text-sm text-muted-foreground animate-pulse">
        Loading alternatives…
      </div>
    );
  }

  if (!proprietaryApp || !proprietaryApp.openSourceAlternatives?.length) {
    return null;
  }

  return (
    <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
      {proprietaryApp.openSourceAlternatives.map(alt => {
        const capCount = alt.capabilities?.length || 0;
        const isExpanded = expandedApp === alt.slug;

        return (
          <li key={alt.id} className="transition-opacity duration-200">
            <div
              className="flex items-center gap-2 py-1.5 cursor-pointer group"
              onClick={() => onToggleExpand(isExpanded ? null : alt.slug)}
            >
              <ToolIcon
                name={alt.name}
                simpleIconSlug={alt.simpleIconSlug || undefined}
                simpleIconColor={alt.simpleIconColor || undefined}
                size={16}
                rounded="none"
                className="shrink-0"
              />

              {/* App name + description */}
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
              <div className="flex items-center gap-2 shrink-0 text-[0.75rem] text-muted-foreground/60 font-mono uppercase truncate hidden sm:flex">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {formatStars(alt.githubStars)}
                </span>
                {alt.license && (
                  <>
                    <span>·</span>
                    <span>{alt.license}</span>
                  </>
                )}
              </div>

              {/* Feature count */}
              <p className="shrink-0 font-mono text-[0.79rem] tabular-nums text-muted-foreground/60 uppercase whitespace-nowrap transition-colors group-hover:text-muted-foreground">
                {capCount} {capCount === 1 ? 'feat' : 'feats'}
              </p>

              {/* Expand chevron */}
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground/40 transition-transform duration-200 shrink-0',
                  isExpanded && 'rotate-180'
                )}
              />
            </div>

            {/* Accordion: Capabilities as Chips */}
            {isExpanded && alt.capabilities && (
              <div className="pb-4 pt-2">
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
                        onToggle={onToggleCapability}
                        apps={openSourceApps}
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
  );
}
