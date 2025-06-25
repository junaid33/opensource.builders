/**
 * Server-side implementation for checkbox fields
 */

// Import shared filter types
import { getFilterTypes, formatFilterLabel, FilterTypes } from '../filterTypes'; // Import FilterTypes

// GraphQL selection for checkbox fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return path
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Type value as any and add return type
  // Convert string 'true'/'false' to boolean
  const boolValue = value === "true"

  // Handle the 'not' operator
  if (operator === "not") {
    return {
      [path]: {
        not: { equals: boolValue },
      },
    }
  }

  // Default to equality check
  return {
    [path]: {
      equals: boolValue,
    },
  }
}

// Re-export the formatFilterLabel from filterTypes
export { formatFilterLabel, getFilterTypes }

