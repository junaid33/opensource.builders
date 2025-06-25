import { getFieldTypeFromViewsIndex, getField } from "@/features/dashboard/views/registry";
import { ListMeta } from "@/features/dashboard/types/admin-meta";

/**
 * Builds GraphQL selections for a list of fields
 * 
 * @param list The list metadata
 * @param fieldKeys Array of field keys to include in the selection
 * @returns A string containing the GraphQL selection fragment
 */
export function buildGraphQLSelections(
  list: ListMeta,
  fieldKeys: string[]
): string {
  // Always include id
  const selections = ["id"];

  // Add selections for each requested field
  fieldKeys.forEach(fieldKey => {
    const field = list.fields[fieldKey];
    if (!field) return;
    
    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType);

    if (fieldImpl?.graphql?.getGraphQLSelection) {
      selections.push(
        fieldImpl.graphql.getGraphQLSelection(fieldKey, field.fieldMeta as any)
      );
    } else {
      selections.push(fieldKey);
    }
  });

  return selections.join("\n");
}
