'use client';

import { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CapabilityDropdownChip } from '../components/shared';
import { useCapabilityActions, useSelectedCapabilities } from '@/hooks/use-capabilities-config';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';
import ToolIcon from '@/components/ToolIcon';

function formatStars(n: number): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface CategoryPageClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    proprietaryApplications: Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      simpleIconSlug?: string | null;
      simpleIconColor?: string | null;
      openSourceAlternatives: Array<{
        id: string;
        name: string;
        slug: string;
        description?: string;
        githubStars?: number;
        license?: string;
        repositoryUrl?: string;
        websiteUrl?: string;
        simpleIconSlug?: string | null;
        simpleIconColor?: string | null;
        capabilities?: Array<{
          capability: {
            id: string;
            name: string;
            slug: string;
            description?: string;
          };
          isActive?: boolean;
          implementationNotes?: string;
          githubPath?: string;
          documentationUrl?: string;
        }>;
      }>;
    }>;
  };
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

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

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

  // Flatten all alternatives from all proprietary apps in this category
  const allAlternatives = category.proprietaryApplications.flatMap(app =>
    app.openSourceAlternatives.map(alt => ({
      ...alt,
      proprietaryAppName: app.name,
      proprietaryAppSlug: app.slug,
    }))
  );

  const altCount = allAlternatives.length;

  return (
    <>
      {/* Header */}
      <div className="py-12">
        <h1 className="font-instrument-serif text-[3rem] sm:text-[4.8rem] leading-[1] tracking-tighter max-w-[900px]">
          Open source alternatives for <i>{category.name}</i>
        </h1>
        {category.description && (
          <p className="mt-10 leading-relaxed text-muted-foreground text-xl sm:text-2xl max-w-[650px] font-medium">
            {category.description}
          </p>
        )}
      </div>

      {/* Section title */}
      <section className="my-12">
        <h2 className="font-instrument-serif text-[1.3rem] mb-6">
          Browse <i>Alternatives:</i>
        </h2>

        {/* Alternatives list */}
        {altCount > 0 ? (
          <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
            {allAlternatives.map(alt => {
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

                    <p className="shrink-0 font-mono text-[0.79rem] tabular-nums text-muted-foreground/60 uppercase whitespace-nowrap transition-colors group-hover:text-muted-foreground">
                      {capCount} {capCount === 1 ? 'feat' : 'feats'}
                    </p>

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
          <p className="mt-9 text-sm text-muted-foreground">
            No open source alternatives found in this category yet.
          </p>
        )}
      </section>
    </>
  );
}
