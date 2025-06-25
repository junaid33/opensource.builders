import { getFieldTypeFromViewsIndex, getField } from "@/features/dashboard/views/registry"
import type { List } from '@/features/dashboard/types'
import type { Field } from '@/features/dashboard/views/registry'

// Utility functions for working with fields

/**
 * Get the selected fields from search parameters
 */
export function getSelectedFields(list: List, searchParams: Record<string, string | string[]>) {
  // Try to get fields from URL
  if (searchParams.fields) {
    const fields = (Array.isArray(searchParams.fields) ? searchParams.fields[0] : searchParams.fields).split(",")

    // Filter to only include fields that exist and are visible
    const validFields = fields.filter(
      (field: string) => list.fields[field] && list.fields[field].listView?.fieldMode !== "hidden",
    )

    // If we have valid fields, use them
    if (validFields.length > 0) {
      // Always include ID
      // if (!validFields.includes("id")) {
      //   validFields.push("id")
      // }
      return validFields
    }
  }

  // If no valid fields from URL, use initialColumns
  if (list.initialColumns && list.initialColumns.length > 0) {
    const initialFields = [...list.initialColumns]

    // Always include ID
    // if (!initialFields.includes("id")) {
    //   initialFields.push("id")
    // }

    return initialFields
  }

  // If no initialColumns, use all visible fields
  const allVisibleFields = Object.entries(list.fields)
    .filter(([, field]) => field.listView?.fieldMode !== "hidden") // Remove unused key variable '_'
    .map(([path]) => path)

  // Always include ID
  // if (!allVisibleFields.includes("id")) {
  //   allVisibleFields.push("id")
  // }

  return allVisibleFields
}

// Helper function to get GraphQL selections for a field
export function getFieldSelections(field: Field, fieldKey: string) {
  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex)
  const fieldImpl = getField(fieldType)

  if (fieldImpl?.graphql?.getGraphQLSelection) {
    return fieldImpl.graphql.getGraphQLSelection(fieldKey)
  }

  return fieldKey
}

