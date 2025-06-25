import { getSort } from "@/features/dashboard/lib/sort";
import { ListMeta } from "@/features/dashboard/types/admin-meta";

/**
 * Builds a GraphQL orderBy clause from search parameters
 * 
 * @param list The list metadata
 * @param searchParams Search parameters containing sort information
 * @returns An array of orderBy objects for GraphQL query
 */
export function buildOrderByClause(
  list: ListMeta,
  searchParams: Record<string, string | string[] | undefined>
): Array<Record<string, 'asc' | 'desc'>> | undefined {
  const sort = getSort(list, searchParams);
  
  if (!sort) {
    return undefined;
  }
  
  return [{ [sort.field]: sort.direction.toLowerCase() as 'asc' | 'desc' }];
}
