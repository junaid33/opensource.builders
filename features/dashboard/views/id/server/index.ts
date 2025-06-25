/**
 * Server-side implementation for ID fields
 */

// GraphQL selection for ID fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add fieldMeta argument
  return path;
}

// Transform filter parameters for the GraphQL query
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Change value type, add return type
  const valueWithoutWhitespace = value.replace(/\s/g, "");
  if (operator === "not") {
    return {
      [path]: {
        not: { equals: valueWithoutWhitespace },
      },
    };
  }
  const key = operator === "is" ? "equals" : operator === "not_in" ? "notIn" : operator;
  return {
    [path]: {
      [key]: ["in", "not_in"].includes(operator)
        ? valueWithoutWhitespace.split(",")
        : valueWithoutWhitespace,
    },
  };
}

// Import the shared filter types instead of duplicating
import { getFilterTypes, FilterTypes } from '../filterTypes'; // Import FilterTypes

// Format the filter label
export function formatFilterLabel(operator: string, value: any): string { // Change value type
  const filterTypes = getFilterTypes();
  const filterType = filterTypes[operator as keyof FilterTypes]; // Add type assertion

  if (!filterType) return "";

  // Handle list operators
  if (operator === "in" || operator === "not_in") {
    const values = value
      .split(",")
      .map((v: string) => v.trim()) // Add type to 'v'
      .join(", ");
    return `${filterType.label.toLowerCase()}: ${values}`;
  }

  // Remove whitespace for display
  const displayValue = value.replace(/\s/g, "");
  return `${filterType.label.toLowerCase()}: ${displayValue}`;
}

