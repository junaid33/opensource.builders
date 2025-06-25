/**
 * Server-side implementation for bigInt fields
 */

// Import shared implementations
import { getGraphQLSelection } from '../graphql';
import { getFilterTypes, formatFilterLabel } from '../filterTypes';

/**
 * Transforms filter parameters for the GraphQL query
 * @param path The field path
 * @param operator The filter operator
 * @param value The filter value
 * @returns The transformed filter
 */
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type to any
  // Remove whitespace
  const valueWithoutWhitespace = value.replace(/\s/g, "");
  
  // Parse the value based on operator type
  const parsed = 
    operator === "in" || operator === "not_in"
      ? valueWithoutWhitespace.split(",").map((x: string) => BigInt(x)) // Use BigInt instead of parseInt
      : BigInt(valueWithoutWhitespace);
  
  // Handle special case for 'not' operator
  if (operator === "not") {
    return { [path]: { not: { equals: parsed } } };
  }
  
  // Map operators to their Prisma equivalents
  const key = 
    operator === "is" ? "equals" : 
    operator === "not_in" ? "notIn" : 
    operator;
  
  return { [path]: { [key]: parsed } };
}

// Re-export shared implementations
export { getGraphQLSelection, getFilterTypes, formatFilterLabel }