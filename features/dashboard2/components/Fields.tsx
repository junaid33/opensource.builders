/**
 * Fields component - Following Keystone's exact pattern
 * Creates controllers and renders fields dynamically using viewsIndex
 */

'use client'

import React, { useMemo } from 'react'

// Exact copy from Keystone - testFilter function
function applyFilter<T>(
  filter: {
    equals?: T
    in?: T[]
  },
  val: T
): boolean {
  if (filter.equals !== undefined && val !== filter.equals) return false
  if (filter.in !== undefined && !filter.in.includes(val)) return false
  return true
}

export function testFilter(
  filter: any | undefined,
  serialized: Record<string, unknown>
): boolean {
  if (filter === undefined) return false
  if (typeof filter === 'boolean') return filter
  for (const [key, filterOnField] of Object.entries(filter)) {
    const serializedValue = serialized[key]
    if (!applyFilter(filterOnField as any, serializedValue)) return false
    if ((filterOnField as any).not !== undefined && applyFilter((filterOnField as any).not, serializedValue)) {
      return false
    }
  }
  return true
}

interface FieldsProps {
  list: any
  fields: Record<string, any>
  value: Record<string, unknown>
  onChange?: (values: Record<string, unknown>) => void
  forceValidation?: boolean
  invalidFields?: ReadonlySet<string>
  isRequireds?: Record<string, any>
}

// Moved deserialization functions to ItemPageClient where they belong

export function Fields({ list, fields, value, onChange, forceValidation, invalidFields, isRequireds }: FieldsProps) {
  // Enhanced fields already have controllers and views - no need to recreate them

  // Create serialized data exactly like Keystone for testFilter
  const serialized = useMemo(() => {
    const result: Record<string, unknown> = {}
    for (const [fieldKey, field] of Object.entries(fields)) {
      try {
        Object.assign(result, field.controller.serialize(value[fieldKey]))
      } catch (error) {
        console.error(`Error serializing field ${fieldKey}:`, error)
      }
    }
    return result
  }, [fields, value])

  return (
    <div className="space-y-6">
      {Object.entries(fields).map(([fieldPath, field]) => {
        const fieldValue = value[fieldPath]
        
        // Get field mode from itemView - following Keystone pattern
        const fieldMode = field.itemView?.fieldMode || 'edit'
        const isReadOnly = fieldMode === 'read' || fieldMode === 'hidden'
        
        if (fieldMode === 'hidden') {
          return null
        }

        return (
          <field.views.Field
            key={fieldPath}
            field={field.controller}
            value={fieldValue}
            forceValidation={forceValidation && invalidFields?.has(fieldPath)}
            isRequired={testFilter(isRequireds?.[fieldPath] ?? false, serialized)}
            onChange={
              isReadOnly || !onChange
                ? undefined
                : (newFieldValue: unknown) => {
                    onChange({
                      ...value,
                      [fieldPath]: newFieldValue,
                    })
                  }
            }
          />
        )
      })}
    </div>
  )
}