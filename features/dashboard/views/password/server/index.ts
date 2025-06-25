import type { FilterTypes } from '../filterTypes'; // Import FilterTypes

/**
 * Server-side implementation for password fields
 */

// GraphQL selection for password fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add types
  return `${path} { isSet }`
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Add types
  // For password fields, we can only filter based on whether a password is set or not
  const isSet = value === "true"

  // Handle the 'not' operator
  if (operator === "not") {
    return {
      [path]: {
        isSet: { not: isSet },
      },
    }
  }

  // Default to equality check
  return {
    [path]: {
      isSet: isSet,
    },
  }
}

// Get available filter types for password fields
export function getFilterTypes(): FilterTypes { // Add return type
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

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Add types
  const isSet = value === "true"

  if (operator === "not") {
    return isSet ? "is not set" : "is set"
  }

  return isSet ? "is set" : "is not set"
}

