import { ComponentType } from 'react'

interface Field {
  path: string
  label: string
  description?: string
  fieldMeta?: {
    isRequired?: boolean
    min?: number
    max?: number
  }
}

interface FieldController {
  path: string
  label: string
  description?: string
  graphqlSelection: string
  defaultValue?: number | null
  deserialize: (item: Record<string, unknown>) => number | null
  validate?: (value: number | null) => boolean
  serialize: (value: number | null) => Record<string, unknown>
  filter?: Record<string, unknown>
}

interface FilterType {
  label: string
  initialValue: string | number
}

interface FilterTypes {
  [key: string]: FilterType
}

interface FilterConfig {
  [path: string]: {
    equals?: number;
    not?: {
      equals?: number;
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
  };
}

interface FieldProps {
  field: Field
  value?: number | null
  onChange?: (value: number | null) => void
  forceValidation?: boolean
}

interface CellProps {
  item: Record<string, unknown>
  field: Field
}

interface FilterProps {
  value: string | number
  onChange: (value: string | number) => void
  operator: string
}

// Export component types
export const Field: ComponentType<FieldProps>
export const Cell: ComponentType<CellProps>
export const Filter: ComponentType<FilterProps>

// Export controller and utility functions
export const controller: (config: Field) => FieldController
export const transformFilter: (path: string, operator: string, value: number) => FilterConfig
export const getGraphQLSelection: (path: string) => string
export const getFilterTypes: () => FilterTypes
export const formatFilterLabel: (operator: string, value: number) => string 