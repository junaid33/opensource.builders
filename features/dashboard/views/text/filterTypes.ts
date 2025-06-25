/**
 * Filter type utilities for text field type
 */

/**
 * Filter type definition
 */
export interface FilterType {
  label: string;
  initialValue: string;
}

/**
 * Filter types record
 */
export interface FilterTypes {
  [key: string]: FilterType;
}

/**
 * Returns available filter types for text fields
 * @returns The filter types
 */
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

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: string): string {
  const filterTypes = getFilterTypes()
  const filterType = filterTypes[operator]
  return filterType ? `${filterType.label.toLowerCase()}: "${value}"` : ""
}
