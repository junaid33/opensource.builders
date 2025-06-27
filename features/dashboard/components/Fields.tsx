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
  view?: 'createView' | 'itemView'
}

export function Fields({ fields, value, onChange, forceValidation, invalidFields, isRequireds, view = 'itemView' }: FieldsProps) {
  // Create serialized data exactly like Keystone for testFilter
  const serialized = useMemo(() => {
    const result: Record<string, unknown> = {}
    for (const [fieldKey, field] of Object.entries(fields)) {
      Object.assign(result, field.controller.serialize(value[fieldKey]))
    }
    return result
  }, [fields, value])

  return (
    <div className="grid w-full items-center gap-4">
      {Object.entries(fields).map(([fieldPath, field]) => {
        const fieldValue = value[fieldPath]
        
        // Get field mode from the appropriate view - following Keystone pattern
        const fieldModeFilter = field[view]?.fieldMode || 'edit'
        let fieldMode: 'read' | 'edit' | 'hidden'
        
        if (typeof fieldModeFilter === 'string') {
          fieldMode = fieldModeFilter as 'read' | 'edit' | 'hidden'
        } else {
          // Handle conditional field modes
          if (testFilter(fieldModeFilter?.edit, serialized)) fieldMode = 'edit'
          else if (view === 'itemView' && testFilter(fieldModeFilter?.read, serialized)) fieldMode = 'read'
          else fieldMode = 'hidden'
        }
        
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