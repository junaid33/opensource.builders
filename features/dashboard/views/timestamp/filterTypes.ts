/**
 * Filter type utilities for timestamp field type
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
 * Returns available filter types for timestamp fields
 * @returns The filter types
 */
export function getFilterTypes(): FilterTypes {
  return {
    equals: {
      label: "Is exactly",
      initialValue: "",
    },
    not_equals: {
      label: "Is not",
      initialValue: "",
    },
    gt: {
      label: "Is after",
      initialValue: "",
    },
    gte: {
      label: "Is after or equal to",
      initialValue: "",
    },
    lt: {
      label: "Is before",
      initialValue: "",
    },
    lte: {
      label: "Is before or equal to",
      initialValue: "",
    },
    in: {
      label: "Is any of",
      initialValue: "",
    },
    not_in: {
      label: "Is none of",
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

  // Format the date(s) for display
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch (e) {
      return dateStr
    }
  }

  // Handle list operators
  if (operator === "in" || operator === "not_in") {
    const dates = value
      .split(",")
      .map((date: string) => formatDate(date.trim())) // Add type to date
      .join(", ")
    return `${filterType.label.toLowerCase()}: ${dates}`
  }

  return `${filterType.label.toLowerCase()}: ${formatDate(value)}`
}
