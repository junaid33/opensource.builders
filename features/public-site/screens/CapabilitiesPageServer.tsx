import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { CapabilitiesPageClient } from './CapabilitiesPage';
import { queryKeys } from '../lib/query-keys';
import { fetchCapabilityApplications } from '../lib/data';
import { PublicSiteProvider } from '../lib/provider';

interface CapabilitiesPageServerProps {
  slug: string;
}

// Server component that prefetches data using same data functions as client
export async function CapabilitiesPageServer({ slug }: CapabilitiesPageServerProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - prevent immediate refetching on client
      },
    },
  });

  try {
    // Prefetch capability applications data using the same function the client will use
    await queryClient.prefetchQuery({
      queryKey: queryKeys.capabilities.applications(slug),
      queryFn: () => fetchCapabilityApplications(slug),
    });
  } catch (error) {
    console.error('Failed to prefetch capability applications:', error);
    notFound();
  }

  return (
    <PublicSiteProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CapabilitiesPageClient slug={slug} />
      </HydrationBoundary>
    </PublicSiteProvider>
  );
}