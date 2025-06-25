/**
 * Filter type utilities for document field type
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
 * Returns available filter types for document fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    contains: {
      label: "Contains text",
      initialValue: "",
    },
    not_contains: {
      label: "Does not contain text",
      initialValue: "",
    },
    is_empty: {
      label: "Is empty",
      initialValue: "true",
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

  if (!filterType) return ""

  // Handle special cases
  switch (operator) {
    case "is_empty":
      return value === "true" ? "is empty" : "is not empty"
    case "contains":
      return `contains: "${value}"`
    case "not_contains":
      return `does not contain: "${value}"`
    default:
      return `${filterType.label.toLowerCase()}: ${value}`
  }
}
