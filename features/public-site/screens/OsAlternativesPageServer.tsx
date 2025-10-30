import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { OsAlternativesPageClient } from './OsAlternativesPage';
import { queryKeys } from '../lib/query-keys';
import { fetchOsAlternatives } from '../lib/data';

interface OsAlternativesPageServerProps {
  slug: string;
}

// Server component that prefetches data using same data functions as client
export async function OsAlternativesPageServer({ slug }: OsAlternativesPageServerProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - prevent immediate refetching on client
      },
    },
  });

  try {
    // Prefetch OS alternatives data using the same function the client will use
    await queryClient.prefetchQuery({
      queryKey: queryKeys.osApps.alternatives(slug),
      queryFn: () => fetchOsAlternatives(slug),
    });
  } catch (error) {
    console.error('Failed to prefetch OS alternatives:', error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OsAlternativesPageClient slug={slug} />
    </HydrationBoundary>
  );
}