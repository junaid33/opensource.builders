'use client';

import { useState } from 'react';
import { useCapabilityApplications } from '../lib/hooks';
import { Container, Spacer, PageHeader } from '../components/shared';
import { Footer } from '../components/landing/Footer';
import { DataTableDrawer } from '@/components/ui/DataTableDrawer';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';
import Link from 'next/link';
import { Star, ChevronDown, Globe } from 'lucide-react';
import { CapabilityDropdownChip } from '../components/shared/CapabilityDropdownChip';
import { cn } from '@/lib/utils';
import ToolIcon from '@/components/ToolIcon';
import { useCapabilityActions, useSelectedCapabilities } from '@/hooks/use-capabilities-config';

function formatStars(n: number): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface CapabilitiesPageClientProps {
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

export function CapabilitiesPageClient({ slug }: CapabilitiesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const { data: capabilityData, error: capabilityError } = useCapabilityApplications(slug);

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
      setDrawerOpen(true);
    }
  };

  if (capabilityError || !capabilityData) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-red-500 mb-2">Failed to load</p>
          <p className="text-muted-foreground text-sm">
            {capabilityError?.message || 'Capability not found'}
          </p>
        </div>
      </Container>
    );
  }

  const { capability, proprietaryApplications, openSourceApplications } = capabilityData;

  return (
    <Container>
      <PageHeader
        title={capability.name}
        subtitle={`Applications with this capability${capability.description ? ` — ${capability.description}` : ''}`}
      />

      <Spacer />

      {/* Proprietary Apps with this capability */}
      {proprietaryApplications.length > 0 && (
        <section className="my-12">
          <h2 className="font-instrument-serif text-[1.3rem] mb-6">
            <i>Proprietary:</i>
          </h2>
          <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
            {proprietaryApplications.map(app => (
              <li key={app.id} className="flex items-center gap-2 py-1.5 transition-opacity duration-200 group">
                <ToolIcon
                  name={app.name}
                  simpleIconSlug={app.simpleIconSlug}
                  simpleIconColor={app.simpleIconColor}
                  size={16}
                  rounded="none"
                  className="shrink-0"
                />
                <Link
                  href={`/alternatives/${app.slug}`}
                  className="font-medium text-foreground no-underline hover:underline shrink truncate"
                >
                  {app.name}
                </Link>
                <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Open Source Apps with this capability */}
      {openSourceApplications.length > 0 && (
        <>
          {proprietaryApplications.length > 0 && <Spacer />}
          <section className="my-12">
            <h2 className="font-instrument-serif text-[1.3rem] mb-6">
              <i>Open Source:</i>
            </h2>
            <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
              {openSourceApplications.map(app => {
                const isExpanded = expandedApp === app.slug;
                const capCount = (app as any).capabilities?.length || 0;
                
                return (
                  <li key={app.id} className="transition-opacity duration-200">
                    <div 
                      className="flex items-center gap-2 py-1.5 cursor-pointer group"
                      onClick={() => setExpandedApp(isExpanded ? null : app.slug)}
                    >
                      <ToolIcon
                        name={app.name}
                        simpleIconSlug={app.simpleIconSlug}
                        simpleIconColor={app.simpleIconColor}
                        size={16}
                        rounded="none"
                        className="shrink-0"
                      />
                      <Link
                        href={`/os-alternatives/${app.slug}`}
                        onClick={e => e.stopPropagation()}
                        className="font-medium text-foreground no-underline hover:underline shrink truncate"
                      >
                        {app.name}
                      </Link>
                      <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />
                      
                      {/* Stars & License */}
                      <div className="hidden shrink-0 items-center gap-2 truncate font-mono text-[0.75rem] uppercase text-zinc-600 dark:text-zinc-300 sm:flex">
                        {(app as any).repositoryUrl ? (
                          <a
                            href={(app as any).repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                          >
                            <Star className="h-3.5 w-3.5" />
                            {formatStars((app as any).githubStars)}
                          </a>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" />
                            {formatStars((app as any).githubStars)}
                          </span>
                        )}
                        {(app as any).license && (
                          <>
                            <span>·</span>
                            <span>{(app as any).license}</span>
                          </>
                        )}
                        {(app as any).websiteUrl && (
                          <a
                            href={(app as any).websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                            aria-label={`${app.name} website`}
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
                    {isExpanded && (app as any).capabilities && (
                      <div className="pl-5 pb-4 pt-2">
                        <div className="flex flex-wrap gap-2">
                          {/* Sort to put current capability first */}
                          {[...(app as any).capabilities]
                            .sort((a, b) => {
                              if (a.capability.slug === slug) return -1;
                              if (b.capability.slug === slug) return 1;
                              return 0;
                            })
                            .map((cap: any) => {
                              const compositeId = `${app.id}-${cap.capability.id}`;
                              const isSelected = selectedCapabilities.some((c: any) => c.id === compositeId);
                              const isCurrentCapability = cap.capability.slug === slug;

                              return (
                                <CapabilityDropdownChip
                                  key={cap.capability.id}
                                  capability={cap.capability}
                                  openSourceAppId={app.id}
                                  openSourceAppName={app.name}
                                  toolIcon={app.simpleIconSlug}
                                  toolColor={app.simpleIconColor}
                                  toolRepo={app.repositoryUrl}
                                  isSelected={isSelected}
                                  onToggle={handleToggleCapability}
                                  apps={apps}
                                  isActive={cap.isActive !== false}
                                  isHighlighted={isCurrentCapability}
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
          </section>
        </>
      )}

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
