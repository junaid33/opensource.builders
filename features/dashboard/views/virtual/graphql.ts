/**
 * GraphQL utilities for virtual field type
 */

/**
 * Field metadata for virtual fields
 */
export interface FieldMeta {
  query?: string;
}

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @param fieldMeta The field metadata
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string, fieldMeta?: FieldMeta): string {
  // Virtual fields require a query to be specified in their field metadata
  return `${path}${fieldMeta?.query || ""}`
}
