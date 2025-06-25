/**
 * GraphQL utilities for image field type
 */

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string): string {
  // For image fields, we need to select additional properties
  return `${path} {
    url
    id
    extension
    width
    height
    filesize
  }`
}
