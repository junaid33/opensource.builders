import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MaybePromise } from "@/features/dashboard/types";

// Define return type for the hook
type QueryParamsHookResult = {
  resetToDefaults: () => void;
};

/**
 * Hook to manage query parameters in localStorage
 * @param listKey - The key of the list to store parameters for
 * @returns Object with resetToDefaults function
 */
export function useQueryParamsFromLocalStorage(listKey: string): QueryParamsHookResult {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Create a query object that behaves like the old query object
  const query: Record<string, string> = {};
  for (let [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  const localStorageKey = `keystone.list.${listKey}.list.page.info`;

  const storeableQueries = ["sortBy", "fields"];
  const resetToDefaults = () => {
    localStorage.removeItem(localStorageKey);
    // Assuming you are using 'router' from 'next/router'
    router.push(pathname);
  };

  // GET QUERY FROM CACHE IF CONDITIONS ARE RIGHT
  // MERGE QUERY PARAMS FROM CACHE WITH QUERY PARAMS FROM ROUTER
  useEffect(() => {
    let hasSomeQueryParamsWhichAreAboutListPage = Object.keys(
      query
    ).some((x) => {
      return x.startsWith("!") || storeableQueries.includes(x);
    });

    if (!hasSomeQueryParamsWhichAreAboutListPage && 'isReady' in router) {
      const queryParamsFromLocalStorage = localStorage.getItem(localStorageKey);
      let parsed: Record<string, string> | undefined;
      try {
        if (queryParamsFromLocalStorage) {
          parsed = JSON.parse(queryParamsFromLocalStorage);
        }
      } catch (err) {
        // Silently handle parsing errors
      }
      if (parsed) {
        router.replace({ query: { ...query, ...parsed } } as any);
      }
    }
  }, [localStorageKey, router, pathname, query]);

  useEffect(() => {
    let queryParamsToSerialize: Record<string, string> = {};
    Object.keys(query).forEach((key) => {
      if (key.startsWith("!") || storeableQueries.includes(key)) {
        queryParamsToSerialize[key] = query[key];
      }
    });
    if (Object.keys(queryParamsToSerialize).length) {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(queryParamsToSerialize)
      );
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [localStorageKey, router, query]);

  return { resetToDefaults };
}
