import { useMemo } from 'react'
import type { FieldMeta } from '@/features/dashboard/types'
import type { Value } from './useChangedFieldsAndDataForUpdate'

/**
 * Hook that identifies which fields have validation errors
 * Each field type owns its validation logic through its controller
 * 
 * @param fields - Object containing field definitions with controllers
 * @param value - Current form values
 * @returns Set of field keys that have validation errors
 */
export function useInvalidFields (
  fields: Record<string, FieldMeta>,
  value: Value
): ReadonlySet<string> {
  return useMemo(() => {
    const invalidFields = new Set<string>()

    Object.keys(value).forEach(fieldPath => {
      const val = value[fieldPath]

      if (val.kind === 'value') {
        const validateFn = fields[fieldPath].controller.validate
        if (validateFn) {
          const result = validateFn(val.value)
          if (result === false) {
            invalidFields.add(fieldPath)
          }
        }
      }
    })
    return invalidFields
  }, [fields, value])
}