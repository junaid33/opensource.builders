/**
 * Filter type utilities for relationship field type
 */

/**
 * Filter type definition
 */
export interface FilterType {
  label: string;
  initialValue: string;
}

/**
 * Filter types record
 */
export interface FilterTypes {
  [key: string]: FilterType;
}

/**
 * Field metadata for relationship fields
 */
export interface FieldMeta {
  refListKey: string;
  refLabelField?: string;
  many?: boolean;
  plural?: string;
  searchFields?: string[];
}

/**
 * Returns available filter types for relationship fields
 * @param fieldMeta The field metadata
 * @returns The filter types
 */
export function getFilterTypes(fieldMeta: FieldMeta): FilterTypes {
  if (fieldMeta?.many) {
    return {
      some: { label: "Some match", initialValue: "" },
      none: { label: "None match", initialValue: "" },
      every: { label: "All match", initialValue: "" },
    };
  }
  return {
    is: { label: "Is", initialValue: "" },
    not: { label: "Is not", initialValue: "" },
    in: { label: "Is one of", initialValue: "" },
    not_in: { label: "Is not one of", initialValue: "" },
  };
}

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @param fieldMeta The field metadata
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: string, fieldMeta: FieldMeta): string {
  const filterTypes = getFilterTypes(fieldMeta);
  const filterType = filterTypes[operator as keyof typeof filterTypes] as FilterType | undefined;
  if (!filterType) return "";
  if (value === "null") return operator === "is" ? "is null" : "is not null";
  if (["in", "not_in", "some", "none", "every"].includes(operator)) {
    const ids = value.split(",").map((id: string) => id.trim()); // Add type to id
    return `${filterType.label.toLowerCase()}: [${ids.join(", ")}]`;
  }
  return `${filterType.label.toLowerCase()}: ${value}`;
}
