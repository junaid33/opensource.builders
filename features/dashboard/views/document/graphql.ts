/**
 * GraphQL utilities for document field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For document fields, we need to select the document property
  return `${path} {
    document
  }`
}
