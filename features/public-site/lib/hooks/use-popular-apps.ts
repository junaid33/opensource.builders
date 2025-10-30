'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchPopularApps } from '../data';

export function usePopularApps() {
  return useQuery({
    queryKey: queryKeys.popularApps.list(),
    queryFn: fetchPopularApps, // Same function used by server prefetch
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}