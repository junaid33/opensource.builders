/**
 * GraphQL utilities for bigInt field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For bigInt fields, we just need the basic path
  return path
}