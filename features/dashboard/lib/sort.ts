/**
 * Get the sort configuration from search parameters
 */

import { ListMeta } from "@/features/dashboard/types/admin-meta";

interface SortConfig {
  field: string;
  direction: 'ASC' | 'DESC';
}

export function getSort(list: ListMeta, searchParams: Record<string, string | string[] | undefined>): SortConfig | null {
  const sortBy = Array.isArray(searchParams.sortBy) ? searchParams.sortBy[0] : searchParams.sortBy

  if (!sortBy) {
    // Use initial sort from list if available
    if (list.initialSort !== null && isOrderable(list, list.initialSort.field)) {
      return list.initialSort
    }
    return null
  }

  // Handle descending sort (prefixed with -)
  let direction: 'ASC' | 'DESC' = "ASC"
  let field = sortBy

  if (sortBy.startsWith("-")) {
    direction = "DESC"
    field = sortBy.substring(1)
  }

  // Verify the field is orderable
  if (!isOrderable(list, field)) {
    return null
  }

  return {
    field,
    direction,
  }
}

/**
 * Check if a field is orderable
 */
function isOrderable(list: ListMeta, fieldPath: string): boolean {
  const field = list.fields[fieldPath]
  return field && field.isOrderable
}

