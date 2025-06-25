/**
 * GraphQL utilities for checkbox field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For checkbox fields, we just need the basic path
  return path
}
