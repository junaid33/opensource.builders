/**
 * Server-side implementation for float field type
 */

// Import shared filter types
import { getFilterTypes, formatFilterLabel } from '../filterTypes'; // Removed FilterTypes import for now

/**
 * Returns the path for GraphQL selection
 */
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return path
}

/**
 * Transforms filter parameters for GraphQL queries
 * @param path The field path
 * @param operator The filter operator
 * @param value The filter value
 * @returns The transformed filter
 */
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type to any
  // Remove whitespace and handle list operators
  const valueWithoutWhitespace = value.replace(/\s/g, "")
  const parsed =
    operator === "in" || operator === "not_in"
      ? valueWithoutWhitespace.split(",").map((x: string) => Number.parseFloat(x))
      : Number.parseFloat(valueWithoutWhitespace)

  // Map operators to their Prisma equivalents
  const operatorMap: Record<string, string> = {
    is: "equals",
    not: "not",
    gt: "gt",
    lt: "lt",
    gte: "gte",
    lte: "lte",
    in: "in",
    not_in: "notIn",
  }

  // Handle special case for 'not' operator
  if (operator === "not") {
    return {
      [path]: {
        not: { equals: parsed },
      },
    }
  }

  // Return the transformed filter
  return {
    [path]: {
      [operatorMap[operator]]: parsed,
    },
  }
}

// Re-export the shared filter types
export { getFilterTypes, formatFilterLabel }

