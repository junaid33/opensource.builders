import type { FilterTypes } from '../filterTypes'; // Import FilterTypes

/**
 * Server-side implementation for text fields
 */

// Remove local FilterType and FilterTypes interfaces

interface FilterConfig {
  [path: string]: {
    contains?: string;
    not?: {
      contains?: string;
      equals?: string;
      startsWith?: string;
      endsWith?: string;
    };
    equals?: string;
    startsWith?: string;
    endsWith?: string;
    mode: 'insensitive';
  };
}

// GraphQL selection for text fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return path
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, change return type
  const mode = "insensitive";
  
  switch (operator) {
    case "contains_i": 
      return { [path]: { contains: value, mode } };
    case "not_contains_i": 
      return { [path]: { not: { contains: value }, mode } };
    case "equals_i": 
      return { [path]: { equals: value, mode } };
    case "not_equals_i": 
      return { [path]: { not: { equals: value }, mode } };
    case "starts_with_i": 
      return { [path]: { startsWith: value, mode } };
    case "not_starts_with_i": 
      return { [path]: { not: { startsWith: value }, mode } };
    case "ends_with_i": 
      return { [path]: { endsWith: value, mode } };
    case "not_ends_with_i": 
      return { [path]: { not: { endsWith: value }, mode } };
    default: 
      return {};
  }
}

// Get available filter types for text fields
export function getFilterTypes(): FilterTypes {
  return {
    contains_i: {
      label: "Contains",
      initialValue: "",
    },
    not_contains_i: {
      label: "Does not contain",
      initialValue: "",
    },
    is_i: {
      label: "Is exactly",
      initialValue: "",
    },
    not_i: {
      label: "Is not exactly",
      initialValue: "",
    },
    starts_with_i: {
      label: "Starts with",
      initialValue: "",
    },
    not_starts_with_i: {
      label: "Does not start with",
      initialValue: "",
    },
    ends_with_i: {
      label: "Ends with",
      initialValue: "",
    },
    not_ends_with_i: {
      label: "Does not end with",
      initialValue: "",
    },
  }
}

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Change value type
  const filterTypes = getFilterTypes()
  const filterType = filterTypes[operator as keyof FilterTypes]; // Add type assertion
  return filterType ? `${filterType.label.toLowerCase()}: "${value}"` : ""
}

