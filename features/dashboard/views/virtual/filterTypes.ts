/**
 * Filter type utilities for virtual field type
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
 * Returns available filter types for virtual fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  // Virtual fields don't support filtering
  return {}
}

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: any): string { // Add unused arguments for consistency
  // Virtual fields don't support filtering
  return ""
}
