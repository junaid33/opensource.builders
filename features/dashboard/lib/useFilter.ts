import { useMemo } from "react";
import type { ListMeta } from "@/features/dashboard/types";

// Define types for the filter conditions
type Condition = {
  [key: string]: {
    equals?: string;
    contains?: string;
    mode?: string;
  };
};

type FilterResult = {
  OR: Condition[];
};

/**
 * Hook to create a filter based on search input
 * @param search - The search string
 * @param list - The list configuration
 * @param searchFields - Array of field keys to search in
 * @returns Filter object with OR conditions
 */
export function useFilter(
  search: string,
  list: ListMeta,
  searchFields: string[]
): FilterResult {
  return useMemo(() => {
    if (!search.length)
      return { OR: [] };

    // Assume ID is a string for validation
    const trimmedSearch = search.trim();
    // We can't access idFieldKind directly, so we'll use a simple validation
    const isValidId = trimmedSearch.length > 0;

    const conditions: Condition[] = [];
    if (isValidId) {
      conditions.push({ id: { equals: trimmedSearch } });
    }

    for (const fieldKey of searchFields) {
      if (list.fields[fieldKey]) {
        const field = list.fields[fieldKey];
        conditions.push({
          [field.path]: {
            contains: trimmedSearch,
            mode: field.search === "insensitive" ? "insensitive" : undefined,
          },
        });
      }
    }

    return { OR: conditions };
  }, [search, list, searchFields]);
}
