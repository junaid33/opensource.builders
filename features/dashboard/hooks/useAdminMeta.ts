'use client';

import useSWR from 'swr';
import type { AdminMeta, ListMeta } from '@/features/dashboard/types';

// Consistent SWR key that matches the key used in AdminMetaProvider
const adminMetaSWRKey = 'keystoneAdminMeta';

/**
 * Client-side hook to access the enhanced AdminMeta provided by AdminMetaProvider
 */
export function useAdminMeta(): {
  adminMeta: AdminMeta | undefined;
  isLoading: boolean;
  error: unknown;
} {
  // Fetcher is null - data comes exclusively from SWRConfig fallback in the provider
  const { data, error, isLoading: swrLoading } = useSWR<AdminMeta>(
    adminMetaSWRKey,
    null // No fetcher function needed - data comes from SWRConfig fallback
  );

  // isLoading is true only if data is not yet available
  const isLoading = !data && !error && swrLoading;

  return {
    adminMeta: data,
    isLoading,
    error,
  };
}

/**
 * Client-side hook to access a specific enhanced List configuration by its key
 */
export function useList(listKey: string): {
  list: ListMeta | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { adminMeta, isLoading, error } = useAdminMeta();
  const list = adminMeta?.lists?.[listKey];
  
  return { 
    list, 
    isLoading, 
    error 
  };
}

/**
 * Client-side hook to access a specific enhanced List configuration by its path
 */
export function useListByPath(path: string): {
  list: ListMeta | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { adminMeta, isLoading, error } = useAdminMeta();
  const list = adminMeta?.listsByPath?.[path];
  
  return { 
    list, 
    isLoading, 
    error 
  };
} 