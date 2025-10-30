'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchOsAlternatives } from '../data';

export function useOsAlternatives(slug: string) {
  return useQuery({
    queryKey: queryKeys.osApps.alternatives(slug),
    queryFn: () => fetchOsAlternatives(slug), // Same function used by server prefetch
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!slug,
  });
}