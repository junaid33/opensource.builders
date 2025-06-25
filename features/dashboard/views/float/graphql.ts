/**
 * GraphQL utilities for float field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For float fields, we just need the basic path
  return path
}
