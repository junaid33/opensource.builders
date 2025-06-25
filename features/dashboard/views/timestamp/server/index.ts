/**
 * Server-side implementation for timestamp fields
 */

import { getGraphQLSelection } from "../graphql"
import { getFilterTypes, formatFilterLabel } from "../filterTypes"

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, add return type
  // Map the operator to its prisma equivalent
  const operatorMap: Record<string, string> = {
    equals: "equals",
    not_equals: "not.equals",
    gt: "gt",
    gte: "gte",
    lt: "lt",
    lte: "lte",
    in: "in",
    not_in: "notIn",
  }

  const key = operatorMap[operator] || "equals"

  // For list operators (in, not_in), parse the comma-separated values
  if (operator === "in" || operator === "not_in") {
    try {
      // Try to parse as JSON first
      const dates = JSON.parse(value)
      return {
        [path]: {
          [key]: Array.isArray(dates) ? dates : [dates],
        },
      }
    } catch {
      // Fallback to comma-separated parsing
      const dates = value.split(",").map((date: string) => date.trim()) // Add type to date
      return {
        [path]: {
          [key]: dates,
        },
      }
    }
  }

  // For single value operators
  return {
    [path]: {
      [key]: value,
    },
  }
}

// Re-export getFilterTypes and formatFilterLabel
export { getFilterTypes, formatFilterLabel }

