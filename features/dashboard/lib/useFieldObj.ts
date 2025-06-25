import { useMemo } from "react";
import type { ListMeta, FieldMeta } from "@/features/dashboard/types";

export function useFieldsObj(
  list: ListMeta | undefined, 
  fields: string[] | undefined
): Record<string, FieldMeta> {
  return useMemo(() => {
    const editFields: Record<string, FieldMeta> = {};
    if (!list || !fields) return editFields;
    
    fields.forEach((fieldPath) => {
      if (list.fields && fieldPath in list.fields) {
        editFields[fieldPath] = list.fields[fieldPath];
      }
    });
    return editFields;
  }, [fields, list?.fields]);
}
