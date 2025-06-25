/**
 * Filter type utilities for decimal field type
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
 * Returns available filter types for decimal fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    equals: {
      label: "Is exactly",
      initialValue: "",
    },
    not: {
      label: "Is not exactly",
      initialValue: "",
    },
    gt: {
      label: "Is greater than",
      initialValue: "",
    },
    gte: {
      label: "Is greater than or equal to",
      initialValue: "",
    },
    lt: {
      label: "Is less than",
      initialValue: "",
    },
    lte: {
      label: "Is less than or equal to",
      initialValue: "",
    },
    in: {
      label: "Is one of",
      initialValue: "",
    },
    not_in: {
      label: "Is not one of",
      initialValue: "",
    },
    empty: {
      label: "Is empty",
      initialValue: "",
    },
    not_empty: {
      label: "Is not empty",
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

  // Handle empty/not_empty operators
  if (operator === "empty" || operator === "not_empty") {
    return filterType.label.toLowerCase()
  }

  // Handle list operators
  if (operator === "in" || operator === "not_in") {
    const values = value
      .split(",")
      .map((v: string) => v.trim())
      .join(", ")
    return `${filterType.label.toLowerCase()}: ${values}`
  }

  return `${filterType.label.toLowerCase()}: ${value}`
}