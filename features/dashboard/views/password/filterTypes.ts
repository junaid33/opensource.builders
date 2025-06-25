/**
 * Filter type utilities for password field type
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
 * Returns available filter types for password fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    is: {
      label: "Is set",
      initialValue: "true",
    },
    not: {
      label: "Is not set",
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
  const isSet = value === "true"

  if (operator === "not") {
    return isSet ? "is not set" : "is set"
  }

  return isSet ? "is set" : "is not set"
}
