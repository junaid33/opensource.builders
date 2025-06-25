/**
 * GraphQL utilities for text field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For text fields, we just need the basic path
  return path
}
