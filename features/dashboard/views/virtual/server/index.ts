/**
 * Server-side implementation for virtual fields
 */

// GraphQL selection for virtual fields
export function getGraphQLSelection(path: string, fieldMeta?: any): string { // Add types
  // Virtual fields require a query to be specified in their field metadata
  return `${path}${fieldMeta?.query || ""}`
}

// Virtual fields don't support filtering
export function transformFilter(path: string, operator: string, value: any): Record<string, any> { // Add types
  return {}
}

// Virtual fields don't have filter types
export function getFilterTypes(): Record<string, never> { // Add return type (empty record)
  return {}
}

// Virtual fields don't have filter labels
export function formatFilterLabel(operator: string, value: any): string { // Add types
  return ""
}

