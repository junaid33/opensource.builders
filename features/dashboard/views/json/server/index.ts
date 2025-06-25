import type { FilterTypes } from '../filterTypes'; // Import FilterTypes

/**
 * Server-side implementation for JSON fields
 */

// GraphQL selection for JSON fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return path
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, add return type
  // For JSON fields, we only support basic equality checks
  // and checking for null/not null values

  // Handle special case for null checks
  if (value === "null") {
    return {
      [path]: operator === "is" ? null : { not: null },
    }
  }

  try {
    // Try to parse the value as JSON
    const parsedValue = JSON.parse(value)

    // Handle the 'not' operator
    if (operator === "not") {
      return {
        [path]: {
          not: { equals: parsedValue },
        },
      }
    }

    // Default to equality check
    return {
      [path]: {
        equals: parsedValue,
      },
    }
  } catch (e) {
    // If parsing fails, treat it as a string search
    return {
      [path]: {
        contains: value,
      },
    }
  }
}

// Get available filter types for JSON fields
export function getFilterTypes(): FilterTypes { // Add return type
  return {
    is: {
      label: "Is",
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
    not_contains: {
      label: "Does not contain",
      initialValue: "",
    },
  }
}

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Change value type
  if (value === "null") {
    return operator === "is" ? "is null" : "is not null"
  }

  try {
    const parsedValue = JSON.parse(value)
    const displayValue = JSON.stringify(parsedValue, null, 2)
    
    switch (operator) {
      case "is":
        return `is ${displayValue}`
      case "not":
        return `is not ${displayValue}`
      case "contains":
        return `contains ${displayValue}`
      case "not_contains":
        return `does not contain ${displayValue}`
      default:
        return ""
    }
  } catch (e) {
    return `${operator} ${value}`
  }
}

