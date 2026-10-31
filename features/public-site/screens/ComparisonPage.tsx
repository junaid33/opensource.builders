'use client';

import { useMemo, useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Container, Lines } from '../components/shared';
import { Footer } from '../components/landing/Footer';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import ToolIcon from '@/components/ToolIcon';
import { useDebouncedSearch } from '../lib/hooks/use-search';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { fetchApplicationBySlug } from '../lib/data';
import type { ComparisonApplication } from '../lib/data';

interface ComparisonPageClientProps {
  app1?: ComparisonApplication;
  app2?: ComparisonApplication;
}

export function ComparisonPageClient({ app1, app2 }: ComparisonPageClientProps) {
  const [selectedSlug1, setSelectedSlug1] = useState(app1?.slug || '');
  const [selectedSlug2, setSelectedSlug2] = useState(app2?.slug || '');
  const [searchOpenFor, setSearchOpenFor] = useState<'app1' | 'app2' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'shared' | 'app1' | 'app2'>('all');

  const { data: searchResults, isLoading: isSearching } = useDebouncedSearch(searchTerm, 300);

  // Fetch full app data when slugs are selected
  const { data: selectedApp1, isLoading: isLoadingApp1 } = useQuery({
    queryKey: ['compare-app', selectedSlug1],
    queryFn: () => fetchApplicationBySlug(selectedSlug1),
    enabled: !!selectedSlug1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: selectedApp2, isLoading: isLoadingApp2 } = useQuery({
    queryKey: ['compare-app', selectedSlug2],
    queryFn: () => fetchApplicationBySlug(selectedSlug2),
    enabled: !!selectedSlug2,
    staleTime: 5 * 60 * 1000,
  });

  // Track selected app names for display while loading
  const [selectedAppName1, setSelectedAppName1] = useState(app1?.name || '');
  const [selectedAppIcon1, setSelectedAppIcon1] = useState(app1?.simpleIconSlug || '');
  const [selectedAppColor1, setSelectedAppColor1] = useState(app1?.simpleIconColor || '');
  const [selectedAppName2, setSelectedAppName2] = useState(app2?.name || '');
  const [selectedAppIcon2, setSelectedAppIcon2] = useState(app2?.simpleIconSlug || '');
  const [selectedAppColor2, setSelectedAppColor2] = useState(app2?.simpleIconColor || '');

  // Update display names when query data loads
  useEffect(() => {
    if (selectedApp1) {
      setSelectedAppName1(selectedApp1.name);
      setSelectedAppIcon1(selectedApp1.simpleIconSlug || '');
      setSelectedAppColor1(selectedApp1.simpleIconColor || '');
    }
  }, [selectedApp1]);

  useEffect(() => {
    if (selectedApp2) {
      setSelectedAppName2(selectedApp2.name);
      setSelectedAppIcon2(selectedApp2.simpleIconSlug || '');
      setSelectedAppColor2(selectedApp2.simpleIconColor || '');
    }
  }, [selectedApp2]);

  // Build unified capability list
  const comparison = useMemo(() => {
    if (!selectedApp1 || !selectedApp2) return null;

    const allCaps = new Map<string, { name: string; slug: string; app1Has: boolean; app2Has: boolean }>();

    selectedApp1.capabilities?.forEach(cap => {
      allCaps.set(cap.capability.slug, {
        name: cap.capability.name,
        slug: cap.capability.slug,
        app1Has: true,
        app2Has: false,
      });
    });

    selectedApp2.capabilities?.forEach(cap => {
      const existing = allCaps.get(cap.capability.slug);
      if (existing) {
        existing.app2Has = true;
      } else {
        allCaps.set(cap.capability.slug, {
          name: cap.capability.name,
          slug: cap.capability.slug,
          app1Has: false,
          app2Has: true,
        });
      }
    });

    const entries = Array.from(allCaps.values()).sort((a, b) => a.name.localeCompare(b.name));

    const shared = entries.filter(e => e.app1Has && e.app2Has).length;
    const onlyApp1 = entries.filter(e => e.app1Has && !e.app2Has).length;
    const onlyApp2 = entries.filter(e => !e.app1Has && e.app2Has).length;

    return { entries, shared, onlyApp1, onlyApp2 };
  }, [selectedApp1, selectedApp2]);

  const handleSelectApp = (app: any) => {
    if (searchOpenFor === 'app1') {
      setSelectedSlug1(app.slug);
      setSelectedAppName1(app.name);
      setSelectedAppIcon1(app.simpleIconSlug || '');
      setSelectedAppColor1(app.simpleIconColor || '');
    } else {
      setSelectedSlug2(app.slug);
      setSelectedAppName2(app.name);
      setSelectedAppIcon2(app.simpleIconSlug || '');
      setSelectedAppColor2(app.simpleIconColor || '');
    }
    setSearchOpenFor(null);
    setSearchTerm('');
  };

  const closeSearch = () => {
    setSearchOpenFor(null);
    setSearchTerm('');
  };

  return (
    <Container>
      {/* Hero Section */}
      <section className="pt-[150px] pb-[50px]">
        <Lines />

        <h1 className="font-instrument-serif text-[3rem] sm:text-[4.8rem] leading-[1] tracking-tighter max-w-[900px]">
          Compare <i>Applications</i>
        </h1>
        <p className="mt-10 leading-relaxed text-muted-foreground text-xl sm:text-2xl max-w-[650px] font-medium">
          Select two applications to compare features side by side.
        </p>
      </section>

      {/* App Selection */}
      <section className="my-12">
        <div className="flex flex-col md:flex-row gap-4">
          {/* App 1 Selection */}
          <div className="flex-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              First Application
            </label>
            <div className="relative">
              <button
                onClick={() => setSearchOpenFor(searchOpenFor === 'app1' ? null : 'app1')}
                className="flex items-center justify-between w-full h-12 px-3 border border-border bg-secondary/50 hover:bg-accent transition-colors text-left"
              >
                {selectedSlug1 ? (
                  <div className="flex items-center gap-3">
                    <ToolIcon
                      name={selectedAppName1}
                      simpleIconSlug={selectedAppIcon1}
                      simpleIconColor={selectedAppColor1}
                      size={20}
                      rounded="none"
                    />
                    <span className="font-medium">{selectedAppName1 || 'Loading...'}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select an application...</span>
                )}
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", searchOpenFor === 'app1' && "rotate-180")} />
              </button>

              {searchOpenFor === 'app1' && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background shadow-lg z-50">
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-sm bg-secondary border border-border outline-none focus:ring-1 focus:ring-muted"
                      />
                    </div>

                    <div className="mt-2 max-h-64 overflow-auto">
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                      ) : searchTerm && searchResults ? (
                        <div className="space-y-1">
                          {searchResults.openSourceApplications.map(app => (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          ))}
                          {searchResults.proprietaryApplications.map(app => (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Start typing to search...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* App 2 Selection */}
          <div className="flex-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Second Application
            </label>
            <div className="relative">
              <button
                onClick={() => setSearchOpenFor(searchOpenFor === 'app2' ? null : 'app2')}
                className="flex items-center justify-between w-full h-12 px-3 border border-border bg-secondary/50 hover:bg-accent transition-colors text-left"
              >
                {selectedSlug2 ? (
                  <div className="flex items-center gap-3">
                    <ToolIcon
                      name={selectedAppName2}
                      simpleIconSlug={selectedAppIcon2}
                      simpleIconColor={selectedAppColor2}
                      size={20}
                      rounded="none"
                    />
                    <span className="font-medium">{selectedAppName2 || 'Loading...'}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select an application...</span>
                )}
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", searchOpenFor === 'app2' && "rotate-180")} />
              </button>

              {searchOpenFor === 'app2' && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background shadow-lg z-50">
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-sm bg-secondary border border-border outline-none focus:ring-1 focus:ring-muted"
                      />
                    </div>

                    <div className="mt-2 max-h-64 overflow-auto">
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                      ) : searchTerm && searchResults ? (
                        <div className="space-y-1">
                          {searchResults.openSourceApplications.map(app => (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          ))}
                          {searchResults.proprietaryApplications.map(app => (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="text-sm font-medium">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Start typing to search...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close search */}
        {searchOpenFor && (
          <div className="fixed inset-0 z-40" onClick={closeSearch} />
        )}
      </section>

      {/* Comparison Table */}
      {selectedApp1 && selectedApp2 && comparison && (
        <section className="my-12">
          <h2 className="font-instrument-serif text-[1.3rem] mb-6">
            <i>{selectedAppName1}</i> vs <i>{selectedAppName2}</i>
          </h2>

          {/* Filter Buttons & Summary */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Filter buttons */}
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'relative flex items-center gap-2 h-8 px-3 text-xs font-medium cursor-pointer border transition-all duration-200',
                filter === 'all'
                  ? 'text-foreground bg-accent border-border/60'
                  : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
              )}
            >
              {filter === 'all' && (
                <>
                  <span className="absolute top-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-t border-foreground" />
                  <span className="absolute top-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-t border-foreground" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-b border-foreground" />
                  <span className="absolute bottom-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-b border-foreground" />
                </>
              )}
              All ({comparison.entries.length})
            </button>
            <button
              onClick={() => setFilter('shared')}
              className={cn(
                'relative flex items-center gap-2 h-8 px-3 text-xs font-medium cursor-pointer border transition-all duration-200',
                filter === 'shared'
                  ? 'text-foreground bg-accent border-border/60'
                  : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
              )}
            >
              {filter === 'shared' && (
                <>
                  <span className="absolute top-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-t border-foreground" />
                  <span className="absolute top-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-t border-foreground" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-b border-foreground" />
                  <span className="absolute bottom-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-b border-foreground" />
                </>
              )}
              <span className="w-1.5 h-1.5 bg-green-400" />
              Shared ({comparison.shared})
            </button>
            <button
              onClick={() => setFilter('app1')}
              className={cn(
                'relative flex items-center gap-2 h-8 px-3 text-xs font-medium cursor-pointer border transition-all duration-200',
                filter === 'app1'
                  ? 'text-foreground bg-accent border-border/60'
                  : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
              )}
            >
              {filter === 'app1' && (
                <>
                  <span className="absolute top-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-t border-foreground" />
                  <span className="absolute top-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-t border-foreground" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-b border-foreground" />
                  <span className="absolute bottom-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-b border-foreground" />
                </>
              )}
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              Only {selectedAppName1} ({comparison.onlyApp1})
            </button>
            <button
              onClick={() => setFilter('app2')}
              className={cn(
                'relative flex items-center gap-2 h-8 px-3 text-xs font-medium cursor-pointer border transition-all duration-200',
                filter === 'app2'
                  ? 'text-foreground bg-accent border-border/60'
                  : 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
              )}
            >
              {filter === 'app2' && (
                <>
                  <span className="absolute top-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-t border-foreground" />
                  <span className="absolute top-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-t border-foreground" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-b border-foreground" />
                  <span className="absolute bottom-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-b border-foreground" />
                </>
              )}
              <span className="w-1.5 h-1.5 bg-pink-400" />
              Only {selectedAppName2} ({comparison.onlyApp2})
            </button>
          </div>

          {/* Column headers */}
          <div className="flex items-center gap-2 py-2 mb-4 text-[0.69rem] font-mono uppercase tracking-wider text-muted-foreground/60">
            <span className="flex-grow">Capability</span>
            <span className="w-20 text-center shrink-0">{selectedAppName1}</span>
            <span className="w-20 text-center shrink-0">{selectedAppName2}</span>
          </div>

          {/* Filtered entries */}
          {(() => {
            const filteredEntries = comparison.entries.filter(entry => {
              if (filter === 'shared') return entry.app1Has && entry.app2Has;
              if (filter === 'app1') return entry.app1Has && !entry.app2Has;
              if (filter === 'app2') return !entry.app1Has && entry.app2Has;
              return true;
            });

            return (
              <ul className="list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map(entry => (
                    <li
                      key={entry.slug}
                      className="flex items-center gap-2 py-1.5 transition-opacity duration-200 group"
                    >
                      <span
                        className="w-1.5 min-w-1.5 h-1.5 shrink-0"
                        style={{
                          background:
                            entry.app1Has && entry.app2Has
                              ? '#4ade80'
                              : entry.app1Has
                                ? '#22d3ee'
                                : '#f472b6',
                        }}
                      />
                      <Link
                        href={`/capabilities/${entry.slug}`}
                        className="font-medium text-foreground no-underline hover:underline shrink truncate"
                      >
                        {entry.name}
                      </Link>
                      <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />
                      <span
                        className={cn(
                          'w-20 text-center shrink-0 font-mono text-[0.79rem]',
                          entry.app1Has ? 'text-green-500' : 'text-red-400/60'
                        )}
                      >
                        {entry.app1Has ? '✓' : '✗'}
                      </span>
                      <span
                        className={cn(
                          'w-20 text-center shrink-0 font-mono text-[0.79rem]',
                          entry.app2Has ? 'text-green-500' : 'text-red-400/60'
                        )}
                      >
                        {entry.app2Has ? '✓' : '✗'}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-sm text-muted-foreground text-center">
                    No features match this filter.
                  </li>
                )}
              </ul>
            );
          })()}
        </section>
      )}

      <Footer />
    </Container>
  );
}
