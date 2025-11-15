import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { AlternativesPageClient } from './AlternativesPage';
import { queryKeys } from '../lib/query-keys';
import { fetchAlternatives } from '../lib/data';
import { PublicSiteProvider } from '../lib/provider';

interface AlternativesPageServerProps {
  slug: string;
}

// Server component that prefetches data using same data functions as client
export async function AlternativesPageServer({ slug }: AlternativesPageServerProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - prevent immediate refetching on client
      },
    },
  });

  try {
    // Prefetch alternatives data using the same function the client will use
    await queryClient.prefetchQuery({
      queryKey: queryKeys.proprietaryApps.alternatives(slug),
      queryFn: () => fetchAlternatives(slug),
    });
  } catch (error) {
    console.error('Failed to prefetch alternatives:', error);
    notFound();
  }

  return (
    <PublicSiteProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AlternativesPageClient slug={slug} />
      </HydrationBoundary>
    </PublicSiteProvider>
  );
}