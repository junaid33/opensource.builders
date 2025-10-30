'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { fetchSearchResults } from '../data';

export function useSearch(searchQuery: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.search.multiModel(searchQuery),
    queryFn: () => fetchSearchResults(searchQuery), // Same function used by server prefetch
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!searchQuery && searchQuery.trim().length > 0,
  });
}

// Hook for debounced search - React Query handles the debouncing via staleTime
export function useDebouncedSearch(searchQuery: string, debounceMs: number = 300) {
  return useSearch(searchQuery, searchQuery.trim().length > 0);
}