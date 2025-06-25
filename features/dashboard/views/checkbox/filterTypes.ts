/**
 * Filter type utilities for checkbox field type
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
 * Returns available filter types for checkbox fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    is: {
      label: "Is checked",
      initialValue: "true",
    },
    not: {
      label: "Is not checked",
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
  const isChecked = value === "true"

  if (operator === "not") {
    return isChecked ? "is not checked" : "is checked"
  }

  return isChecked ? "is checked" : "is not checked"
}
