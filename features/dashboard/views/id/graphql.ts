/**
 * GraphQL utilities for ID field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For ID fields, we just need the basic path
  return path
}
