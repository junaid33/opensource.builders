/**
 * Shared type definitions for the dashboard feature
 * These are basic types that don't depend on other features
 */

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | readonly JSONValue[]
  | { [key: string]: JSONValue }

export type MaybePromise<T> = T | Promise<T>

export interface BaseField {
  path: string
  label: string
  description?: string
  viewsIndex: number
  fieldMeta?: {
    validation?: {
      isRequired?: boolean
      length?: { min: number | null; max: number | null }
      match?: { regex: RegExp; explanation?: string }
    }
    defaultValue?: JSONValue
    isNullable?: boolean
    options?: Array<{ value: JSONValue; label: string }>
    isRequired?: boolean
    min?: number
    max?: number
  }
  itemView?: {
    fieldMode?: 'read' | 'edit' | 'hidden'
    fieldPosition?: string
  }
  listView?: {
    fieldMode?: 'read' | 'hidden'
  }
  createView?: {
    fieldMode?: 'edit' | 'hidden'
  }
  isOrderable?: boolean
  isFilterable?: boolean
}