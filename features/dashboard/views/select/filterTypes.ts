/**
 * Filter type utilities for select field type
 */

/**
 * Filter type definition
 */
export interface FilterType {
  label: string;
  initialValue: string | any[];
}

/**
 * Filter types record
 */
export interface FilterTypes {
  [key: string]: FilterType;
}

/**
 * Returns available filter types for select fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    in: {
      label: "Is any of",
      initialValue: [],
    },
    not_in: {
      label: "Is none of",
      initialValue: [],
    },
    equals: {
      label: "Is exactly",
      initialValue: "",
    },
    not_equals: {
      label: "Is not",
      initialValue: "",
    },
  }
}

/**
 * Formats the filter label based on operator and value
 * @param operator The filter operator
 * @param value The filter value
 * @returns The formatted filter label
 */
export function formatFilterLabel(operator: string, value: string): string {
  const filterTypes = getFilterTypes()
  const filterType = filterTypes[operator]

  if (!filterType) return ""

  let values: any[]
  try {
    values = JSON.parse(value)
  } catch (e) {
    values = [value]
  }

  if (values.length === 0) {
    return operator === "not_in" ? "is set" : "has no value"
  }

  if (values.length > 1) {
    const valueList = values.join(", ")
    return operator === "not_in" ? `is not in [${valueList}]` : `is in [${valueList}]`
  }

  return operator === "not_equals" ? `is not ${values[0]}` : `is ${values[0]}`
}
