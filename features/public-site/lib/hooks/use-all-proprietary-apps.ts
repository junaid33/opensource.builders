'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchAllProprietaryApps } from '../data';

export function useAllProprietaryApps() {
  return useQuery({
    queryKey: queryKeys.proprietaryApps.lists(),
    queryFn: fetchAllProprietaryApps,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}