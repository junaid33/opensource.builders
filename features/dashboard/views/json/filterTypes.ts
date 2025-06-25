/**
 * Filter type utilities for JSON field type
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
 * Returns available filter types for JSON fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    is: {
      label: "Is exactly",
      initialValue: "",
    },
    not: {
      label: "Is not",
      initialValue: "",
    },
    contains: {
      label: "Contains",
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

  if (!filterType) return ""

  // Handle null values
  if (value === "null") {
    return operator === "is" ? "is null" : "is not null"
  }

  try {
    // Try to format as JSON
    const parsedValue = JSON.parse(value)
    const displayValue = JSON.stringify(parsedValue)
    return `${filterType.label.toLowerCase()}: ${displayValue}`
  } catch (e) {
    // If parsing fails, display as is
    return `${filterType.label.toLowerCase()}: "${value}"`
  }
}
