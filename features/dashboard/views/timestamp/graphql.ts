/**
 * GraphQL utilities for timestamp field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For timestamp fields, we just need the basic path
  return path
}
