import type { FilterTypes } from '../filterTypes'; // Import FilterTypes

/**
 * Server-side implementation for select field type
 */
// Add missing getGraphQLSelection function
export function getGraphQLSelection(path: string, fieldMeta?: any): string {
  return path;
}


/**
 * Transforms filter parameters for GraphQL queries
 * @param path The field path
 * @param operator The filter operator
 * @param value The filter value
 * @returns The transformed filter
 */
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, add return type
  let values: string[];
  try {
    values = JSON.parse(value);
  } catch (e) {
    values = value ? [value] : [];
  }

  if (values.length === 0) return {};

  switch (operator) {
    case 'equals':
      return { [path]: { equals: values[0] } };
    case 'not_equals':
      return { [path]: { not: { equals: values[0] } } };
    case 'in':
      return { [path]: { in: values } };
    case 'not_in':
      return { [path]: { not: { in: values } } };
    default:
      return {};
  }
}

// Get available filter types for select fields
export function getFilterTypes(): FilterTypes { // Add return type
  return {
    in: {
      label: "Is any of",
      initialValue: [],
    },
    not_in: {
      label: "Is none of",
      initialValue: [],
    },
    equals: {
      label: "Is exactly",
      initialValue: "",
    },
    not_equals: {
      label: "Is not",
      initialValue: "",
    },
  }
}

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Add types
  const filterTypes = getFilterTypes()
  const filterType = filterTypes[operator as keyof FilterTypes]; // Add type assertion

  if (!filterType) return ""

  let values
  try {
    values = JSON.parse(value)
  } catch (e) {
    values = [value]
  }

  if (values.length === 0) {
    return operator === "not_in" ? "is set" : "has no value"
  }

  if (values.length > 1) {
    const valueList = values.join(", ")
    return operator === "not_in" ? `is not in [${valueList}]` : `is in [${valueList}]`
  }

  return operator === "not_equals" ? `is not ${values[0]}` : `is ${values[0]}`
}

