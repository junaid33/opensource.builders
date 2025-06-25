import { getFieldTypeFromViewsIndex, getField } from "@/features/dashboard/views/registry";
import { ListMeta } from "@/features/dashboard/types/admin-meta";

// Map of field type to ID validation functions
const idValidators: Record<string, (value: string) => boolean> = {
  integer: (value) => !isNaN(parseInt(value)),
  string: (value) => typeof value === 'string' && value.length > 0
};

/**
 * Builds a GraphQL where clause from filter parameters
 * 
 * @param list The list metadata
 * @param filterParams Filter parameters object
 * @returns A GraphQL where clause object
 */
export function buildWhereClause(
  list: ListMeta, 
  filterParams: Record<string, string>
): Record<string, unknown> {
  const filters: Record<string, unknown> = {};

  // Handle search parameter
  if (filterParams?.search) {
    const conditions = [];
    
    // Check if the search term could be an ID
    const searchTerm = filterParams.search.trim();
    const idField = list.fields?.id;
    const idFieldKind = idField?.fieldMeta && typeof idField.fieldMeta === 'object' && 'kind' in idField.fieldMeta ? idField.fieldMeta.kind : null;
    const isValidId = idFieldKind && typeof idFieldKind === 'string' && idValidators[idFieldKind]?.(searchTerm);

    if (isValidId) {
      conditions.push({ id: { equals: searchTerm } });
    }
    
    // Use initialSearchFields from the list for searching
    const searchFields = list.initialSearchFields || [];
    for (const fieldKey of searchFields) {
      const field = list.fields[fieldKey];
      if (field) {
        conditions.push({
          [field.path]: {
            contains: searchTerm,
            mode: field.search === "insensitive" ? "insensitive" : undefined,
          },
        });
      }
    }

    if (conditions.length > 0) {
      filters.OR = conditions;
    }
  }

  // Build possible filters map
  const possibleFilters: Record<string, { type: string; field: string }> = {};
  Object.entries(list.fields).forEach(([fieldPath, field]) => {
    if (field.isFilterable) {
      const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
      const fieldImpl = getField(fieldType);

      if (fieldImpl?.filterTypes?.getFilterTypes) {
        // Add all possible filter types for this field
        const filterTypes = fieldImpl.filterTypes.getFilterTypes();
        Object.keys(filterTypes).forEach((type) => {
          possibleFilters[`!${fieldPath}_${type}`] = { type, field: fieldPath };
        });
      }
    }
  });

  // Process filter parameters by looking them up in possibleFilters
  Object.entries(filterParams || {}).forEach(([key, value]) => {
    if (!key.startsWith('!')) return; // Skip non-filter parameters
    
    const filterConfig = possibleFilters[key];
    if (!filterConfig) return;

    const field = list.fields[filterConfig.field];
    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType);

    // Parse the JSON value
    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value;
    }

    // Transform the filter using the field's implementation
    if (fieldImpl?.server?.transformFilter) {
      const transformedFilter = fieldImpl.server.transformFilter(
        filterConfig.field,
        filterConfig.type,
        parsedValue
      );
      Object.assign(filters, transformedFilter);
    }
  });

  return filters;
}
