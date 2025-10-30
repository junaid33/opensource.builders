'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchAllCapabilities } from '../data';

export function useAllCapabilities() {
  return useQuery({
    queryKey: queryKeys.capabilities.list(),
    queryFn: fetchAllCapabilities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}