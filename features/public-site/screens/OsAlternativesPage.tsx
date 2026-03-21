'use client';

import { useState } from 'react';
import { useOsAlternatives } from '../lib/hooks';
import { Container, Spacer } from '../components/shared';
import { Footer } from '../components/landing/Footer';
import { useCapabilityActions, useSelectedCapabilities, useBuildStatsCardState } from '@/hooks/use-capabilities-config';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, Star, GitFork, Globe } from 'lucide-react';
import { CapabilityDropdownChip } from '../components/shared';
import ToolIcon from '@/components/ToolIcon';

interface OsAlternativesPageClientProps {
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

const CAP_COLORS = [
  '#8b5cf6', '#f472b6', '#22d3ee', '#ef4444', '#6366f1',
  '#f97316', '#a3e635', '#2dd4bf', '#4ade80', '#fbbf24',
  '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4',
];

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function OsAlternativesPageClient({ slug }: OsAlternativesPageClientProps) {
  const [searchValue, setSearchValue] = useState('');
  const [expandedAlt, setExpandedAlt] = useState<string | null>(null);
  const [showAllCaps, setShowAllCaps] = useState(false);
  const INITIAL_CAPS_LIMIT = 15;
  const { data: osAlternativesData, error: osAlternativesError } = useOsAlternatives(slug);

  const { addCapability, removeCapability } = useCapabilityActions();
  const selectedCapabilities = useSelectedCapabilities();

  const { data: apps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest<{ openSourceApplications: any[] }>(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  if (osAlternativesError || !osAlternativesData) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-red-500 mb-2">Failed to load</p>
          <p className="text-muted-foreground text-sm">
            {osAlternativesError?.message || 'Open source application not found'}
          </p>
        </div>
      </Container>
    );
  }

  const { openSourceApp, proprietaryApp, otherAlternatives } = osAlternativesData;

  // Filter capabilities by search
  const filteredCaps = openSourceApp.capabilities?.filter(cap =>
    !searchValue.trim() ||
    cap.capability.name.toLowerCase().includes(searchValue.trim().toLowerCase())
  ) || [];

  const { updateBuildStatsCard } = useBuildStatsCardState();

  const handleToggleCapability = (data: any) => {
    const isAlreadySelected = selectedCapabilities.some(c => c.id === data.id);

    if (isAlreadySelected) {
      removeCapability(data.id);
    } else {
      addCapability(data);
      updateBuildStatsCard({ isDrawerOpen: true });
    }
  };

  return (
    <Container>
      {/* Header */}
      <div className="pb-6 pt-5 sm:pt-7">
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-2 sm:items-baseline">
          <h1 className="font-instrument-serif text-[2rem] leading-[1.2] tracking-tight">
            {openSourceApp.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[0.69rem] font-mono uppercase text-zinc-600 dark:text-zinc-300">
            {openSourceApp.githubStars ? (
              openSourceApp.repositoryUrl ? (
                <a
                  href={openSourceApp.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  <Star className="h-3.5 w-3.5" />
                  {formatStars(openSourceApp.githubStars)}
                </a>
              ) : (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {formatStars(openSourceApp.githubStars)}
                </span>
              )
            ) : null}
            {openSourceApp.githubForks ? (
              <span className="flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                {formatStars(openSourceApp.githubForks)}
              </span>
            ) : null}
            {openSourceApp.websiteUrl && (
              <a
                href={openSourceApp.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                aria-label={`${openSourceApp.name} website`}
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Open Source Alternative to{' '}
          <Link href={`/alternatives/${proprietaryApp.slug}`} className="text-foreground no-underline hover:underline">
            {proprietaryApp.name}
          </Link>
        </p>
        {openSourceApp.license && (
          <p className="mt-1 font-mono text-xs uppercase text-zinc-600 dark:text-zinc-300">
            {openSourceApp.license} License
          </p>
        )}
      </div>

      <Spacer />

      {/* Capabilities Section — chips with + buttons */}
      <section className="my-12">
        <h2 className="font-instrument-serif text-[1.3rem] mb-6">
          <i>Capabilities:</i>
        </h2>

        {/* Search + Capability chips */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search capabilities..."
            value={searchValue}
            onChange={e => setSearchValue(e.currentTarget.value)}
            className="h-9 w-[200px] px-3 text-sm bg-secondary border border-border text-foreground outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-muted"
          />

          {(searchValue || showAllCaps ? filteredCaps : filteredCaps.slice(0, INITIAL_CAPS_LIMIT)).map((cap, i) => {
            const compositeId = `${openSourceApp.id}-${cap.capability.id}`;
            const isSelected = selectedCapabilities.some(c => c.id === compositeId);
            const dotColor = CAP_COLORS[i % CAP_COLORS.length];
            
            return (
              <CapabilityDropdownChip
                key={cap.capability.id}
                capability={cap.capability}
                openSourceAppId={openSourceApp.id}
                openSourceAppName={openSourceApp.name}
                toolIcon={openSourceApp.simpleIconSlug || undefined}
                toolColor={openSourceApp.simpleIconColor || undefined}
                toolRepo={openSourceApp.repositoryUrl || undefined}
                isSelected={isSelected}
                onToggle={handleToggleCapability}
                apps={apps}
                isActive={cap.isActive}
                implementationNotes={cap.implementationNotes}
                githubPath={cap.githubPath}
                documentationUrl={cap.documentationUrl}
              />
            );
          })}

          {/* Show More toggle */}
          {!searchValue && filteredCaps.length > INITIAL_CAPS_LIMIT && (
            <button
              onClick={() => setShowAllCaps(!showAllCaps)}
              className="inline-flex h-9 items-center px-3 text-sm font-medium text-muted-foreground bg-secondary border border-transparent hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              {showAllCaps ? 'Show less' : `+ Show ${filteredCaps.length - INITIAL_CAPS_LIMIT} more`}
            </button>
          )}
        </div>

        {/* Capability details list */}
        {filteredCaps.length > 0 && (
          <ul className="mt-9 list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
            {filteredCaps.map((cap, i) => (
              <li key={cap.capability.id} className="flex items-center gap-2 py-1.5 transition-opacity duration-200 group">
                <span
                  className="w-1.5 min-w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: CAP_COLORS[i % CAP_COLORS.length] }}
                />
                <Link
                  href={`/capabilities/${cap.capability.slug}`}
                  className="font-medium text-foreground no-underline hover:underline shrink truncate"
                >
                  {cap.capability.name}
                </Link>
                <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />
                <p className="shrink-0 whitespace-nowrap font-mono text-[0.79rem] uppercase tabular-nums text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-50">
                  {cap.isActive !== false ? 'Active' : 'Inactive'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Other Alternatives */}
      {otherAlternatives.length > 0 && (
        <>
          <Spacer />
          <section className="my-12">
            <h2 className="font-instrument-serif text-[1.3rem] mb-6">
              Other Alternatives to <i>{proprietaryApp.name}:</i>
            </h2>

            <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
              {otherAlternatives.map(alt => {
                const capCount = alt.capabilities?.length || 0;
                const isExpanded = expandedAlt === alt.slug;

                return (
                  <li key={alt.id} className="transition-opacity duration-200">
                    <div
                      className="flex items-center gap-2 py-1.5 cursor-pointer group"
                      onClick={() => setExpandedAlt(isExpanded ? null : alt.slug)}
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
                          {alt.capabilities.map(cap => (
                            <Link
                              key={cap.capability.id}
                              href={`/capabilities/${cap.capability.slug}`}
                              className={cn(
                                'flex items-center gap-1.5 h-7 px-2.5 text-[0.75rem] font-medium border transition-all duration-200 no-underline',
                                cap.isActive !== false
                                  ? 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
                                  : 'text-muted-foreground/40 bg-secondary/50 border-border/50 line-through'
                              )}
                            >
                              <span>{cap.capability.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <Spacer />
      <Footer />

    </Container>
  );
}
