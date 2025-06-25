import type { FilterTypes } from '../filterTypes'; // Import FilterTypes

/**
 * Server-side implementation for image fields
 */

// GraphQL selection for image fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return `${path} { src id extension width height filesize }`;
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, add return type
  if (operator === "extension") {
    return { [path]: { extension: { equals: value } } };
  }
  if (operator === "is_set") {
    return { [path]: value === "true" ? { not: null } : null };
  }
  return {};
}

// Get available filter types for image fields
export function getFilterTypes(): FilterTypes { // Add return type
  return {
    is_set: {
      label: "Has image",
      initialValue: "true",
    },
    extension: {
      label: "Has extension",
      initialValue: "",
    },
    not_extension: {
      label: "Does not have extension",
      initialValue: "",
    },
    filesize_lt: {
      label: "File size is less than",
      initialValue: "",
    },
    filesize_gt: {
      label: "File size is greater than",
      initialValue: "",
    },
  }
}

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Change value type
  const filterTypes = getFilterTypes()
  const filterType = filterTypes[operator as keyof ReturnType<typeof getFilterTypes>]

  if (!filterType) return ""

  // Handle special cases
  switch (operator) {
    case "is_set":
      return value === "true" ? "has image" : "has no image"
    case "extension":
      return `has extension: ${value}`
    case "not_extension":
      return `does not have extension: ${value}`
    case "filesize_lt":
      return `file size < ${formatFileSize(Number.parseInt(value))}`
    case "filesize_gt":
      return `file size > ${formatFileSize(Number.parseInt(value))}`
    default:
      return `${filterType.label.toLowerCase()}: ${value}`
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

