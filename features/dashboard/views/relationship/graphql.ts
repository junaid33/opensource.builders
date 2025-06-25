/**
 * GraphQL utilities for relationship field type
 */

/**
 * Field metadata for relationship fields
 */
export interface FieldMeta {
  refListKey: string;
  refLabelField?: string;
  many?: boolean;
  plural?: string;
  searchFields?: string[];
}

/**
 * Returns the path for GraphQL selection
 * @param path The field path
 * @param fieldMeta The field metadata
 * @returns The GraphQL selection
 */
export function getGraphQLSelection(path: string, fieldMeta: FieldMeta): string {
  if (fieldMeta?.many) {
    return `
      ${path} {
        id
        label:${fieldMeta.refLabelField || "id"}
      }
      ${path}Count
    `;
  }
  return `${path} {
    id
    label:${fieldMeta.refLabelField || "id"}
  }`;
}