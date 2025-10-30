'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchAllOpenSourceApps } from '../data';

export function useAllOpenSourceApps() {
  return useQuery({
    queryKey: queryKeys.openSourceApps.list(),
    queryFn: fetchAllOpenSourceApps,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}