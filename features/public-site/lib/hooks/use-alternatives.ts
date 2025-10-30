'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchAlternatives } from '../data';

export function useAlternatives(slug: string) {
  return useQuery({
    queryKey: queryKeys.proprietaryApps.alternatives(slug),
    queryFn: () => fetchAlternatives(slug), // Same function used by server prefetch
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!slug,
  });
}