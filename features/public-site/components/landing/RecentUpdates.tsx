'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, Globe, GitFork, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import ToolIcon from '@/components/ToolIcon';
import { fetchRecentOpenSourceApps } from '../../lib/data';
import { queryKeys } from '../../lib/query-keys';
import type { RecentOpenSourceApp } from '../../types';

const PAGE_SIZE = 6;
const MAX_CAPABILITY_CHIPS = 3;
const CARD_WIDTH = 'w-[17.5rem]';

function formatStars(n?: number | null): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatAddedAt(createdAt?: string | null): string | null {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return formatDistanceToNow(date, { addSuffix: true });
}

function statusLabel(status?: string | null): string | null {
  if (!status || status === 'active') return null;
  return status;
}

function RecentUpdateCard({ app }: { app: RecentOpenSourceApp }) {
  const addedAt = formatAddedAt(app.createdAt);
  const proprietary = app.primaryAlternativeTo;
  const capabilities = app.capabilities ?? [];
  const visibleCapabilities = capabilities.slice(0, MAX_CAPABILITY_CHIPS);
  const hiddenCapabilityCount = Math.max(0, capabilities.length - MAX_CAPABILITY_CHIPS);
  const status = statusLabel(app.status);

  return (
    <article className="group relative flex h-full min-h-[15.5rem] min-w-0 flex-col border border-border bg-background transition-colors hover:bg-accent/40">
      <Link
        href={`/os-alternatives/${app.slug}`}
        className="flex min-w-0 flex-1 flex-col p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex items-start gap-3">
          <ToolIcon
            name={app.name}
            simpleIconSlug={app.simpleIconSlug || undefined}
            simpleIconColor={app.simpleIconColor || undefined}
            size={32}
            rounded="none"
            className="shrink-0"
          />

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">{app.name}</h3>
                  {status ? (
                    <span className="font-mono text-[0.62rem] uppercase tracking-wide text-muted-foreground">
                      {status}
                    </span>
                  ) : null}
                </div>
              </div>

              {addedAt ? (
                <span className="shrink-0 border border-border bg-secondary/60 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-wide text-muted-foreground">
                  {addedAt}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {proprietary ? (
          <div className="mt-2.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="shrink-0">Alternative to</span>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-foreground/85">
              <ToolIcon
                name={proprietary.name}
                simpleIconSlug={proprietary.simpleIconSlug || undefined}
                simpleIconColor={proprietary.simpleIconColor || undefined}
                size={14}
                rounded="none"
                className="shrink-0"
              />
              <span className="truncate">{proprietary.name}</span>
            </span>
          </div>
        ) : (
          <p className="mt-2.5 text-xs text-muted-foreground">New catalog entry</p>
        )}

        {app.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-5 text-muted-foreground">{app.description}</p>
        ) : null}

        {visibleCapabilities.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleCapabilities.map(({ capability }, index) => (
              <span
                key={`${capability.id}-${index}`}
                className="border border-border bg-secondary/50 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-muted-foreground"
              >
                {capability.name}
              </span>
            ))}
            {hiddenCapabilityCount > 0 ? (
              <span className="border border-dashed border-border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-muted-foreground">
                +{hiddenCapabilityCount}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 font-mono text-[0.68rem] uppercase tracking-wide text-muted-foreground">
          {app.githubStars ? (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3" aria-hidden="true" />
              {formatStars(app.githubStars)}
            </span>
          ) : null}
          {app.githubForks ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="size-3" aria-hidden="true" />
                {formatStars(app.githubForks)}
              </span>
            </>
          ) : null}
          {app.license ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{app.license}</span>
            </>
          ) : null}
          {capabilities.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {capabilities.length} {capabilities.length === 1 ? 'feat' : 'feats'}
              </span>
            </>
          ) : null}
        </div>
      </Link>

      {(app.repositoryUrl || app.websiteUrl || proprietary) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-wide">
          {proprietary ? (
            <Link
              href={`/alternatives/${proprietary.slug}`}
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Compare stack
            </Link>
          ) : null}
          {app.repositoryUrl ? (
            <a
              href={app.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Repo
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : null}
          {app.websiteUrl ? (
            <a
              href={app.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Globe className="size-3" aria-hidden="true" />
              Site
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}

function RecentUpdatesSkeleton() {
  return (
    <div className="-ml-2 flex gap-2 overflow-hidden">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <div
          key={index}
          className={cn('h-[15.5rem] shrink-0 animate-pulse border border-border bg-secondary/40', CARD_WIDTH)}
        />
      ))}
    </div>
  );
}

export function RecentUpdates() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.openSourceApps.recent(),
    queryFn: ({ pageParam }) => fetchRecentOpenSourceApps(PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((total, page) => total + page.length, 0);
    },
    staleTime: 5 * 60 * 1000,
  });

  const recentApps = useMemo(() => {
    const apps = data?.pages.flat() ?? [];
    const seen = new Set<string>();

    return apps.filter((app) => {
      if (seen.has(app.id)) return false;
      seen.add(app.id);
      return true;
    });
  }, [data?.pages]);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        void fetchNextPage();
      },
      {
        root,
        rootMargin: '0px 360px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, recentApps.length]);

  if (isError || (!isLoading && recentApps.length === 0)) {
    return null;
  }

  return (
    <section className="my-12">
      <div className="mb-6">
        <h2 className="font-instrument-serif text-[1.3rem]">
          Recent <i>Updates</i>
        </h2>
      </div>

      {isLoading ? (
        <RecentUpdatesSkeleton />
      ) : (
        <div
          ref={scrollRef}
          className="fade-x fade-size-x-sm -mx-1 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-2">
            {recentApps.map((app) => (
              <div key={app.id} className={cn('shrink-0', CARD_WIDTH)}>
                <RecentUpdateCard app={app} />
              </div>
            ))}
            {hasNextPage ? (
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-px shrink-0" />
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
