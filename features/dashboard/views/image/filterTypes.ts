/**
 * Filter type utilities for image field type
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
 * Returns available filter types for image fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    extension: { label: "Has extension", initialValue: "" },
    is_set: { label: "Is set", initialValue: "true" },
  };
}

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: string): string {
  const filterTypes = getFilterTypes();
  const filterType = filterTypes[operator];
  return filterType ? `${filterType.label}: ${value}` : "";
}

/**
 * Helper function to format file size
 * @param bytes The file size in bytes
 * @returns The formatted file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
