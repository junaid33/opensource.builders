/**
 * Filter type utilities for float field type
 */

/**
 * Filter type definition
 */
export interface FilterType {
  type: string;
  label: string;
  initialValue: string;
}

/**
 * Filter types record (maps operator type to FilterType)
 */
export interface FilterTypes {
  [key: string]: FilterType;
}

/**
 * Returns available filter types for float fields as a record
 * @returns The filter types record
 */
export function getFilterTypes(): FilterTypes { // Change return type to FilterTypes
  // Transform the array into a record
  const filterTypesArray: FilterType[] = [
    { type: "is", label: "Is exactly", initialValue: "" },
    { type: "not", label: "Is not exactly", initialValue: "" },
    { type: "gt", label: "Is greater than", initialValue: "" },
    { type: "lt", label: "Is less than", initialValue: "" },
    { type: "gte", label: "Is greater than or equal to", initialValue: "" },
    { type: "lte", label: "Is less than or equal to", initialValue: "" },
    { type: "in", label: "Is one of", initialValue: "" },
    { type: "not_in", label: "Is not one of", initialValue: "" },
  ];

  const filterTypesRecord: FilterTypes = {};
  for (const filterType of filterTypesArray) {
    filterTypesRecord[filterType.type] = filterType;
  }
  return filterTypesRecord;
}

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: string): string {
  // Handle list operators (in, not_in)
  const filterTypes = getFilterTypes(); // Get the record
  const filterType = filterTypes[operator]; // Access the specific filter type

  if (!filterType) return ""; // Operator not found

  if (operator === "in" || operator === "not_in") {
    const formattedValue = value
      .split(",")
      .map((v: string) => v.trim())
      .join(", ");
    // Use label from filterType if available, otherwise format operator
    return `${filterType.label}: ${formattedValue}`;
  }

  // Handle single value operators
  // Use the label directly from the filterType object

  return `${filterType.label}: ${value}`;
}
