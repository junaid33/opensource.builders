/**
 * GraphQL utilities for password field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For password fields, we need to select the isSet property
  return `${path} { isSet }`
}
