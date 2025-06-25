import type { GraphQLError } from 'graphql'
import { useMemo } from 'react'
import isDeepEqual from 'fast-deep-equal'
import type { FieldMeta } from '@/features/dashboard/types'
import { type ItemData, deserializeValue, serializeValueToObjByFieldKey } from './serialization' // Removed unused DeserializedValue import
import type { DataGetter } from './dataGetter'

export type Value = Record<
  string,
  | { kind: 'error', errors: readonly [GraphQLError, ...GraphQLError[]] }
  | { kind: 'value', value: unknown } // Align with DeserializedValue definition
>

export function useChangedFieldsAndDataForUpdate (
  fields: Record<string, FieldMeta>,
  itemGetter: DataGetter<ItemData>,
  value: Value
) {
  const serializedValuesFromItem = useMemo(() => {
    const value = deserializeValue(fields, itemGetter)
    return serializeValueToObjByFieldKey(fields, value)
  }, [fields, itemGetter])
  
  const serializedFieldValues = useMemo(() => {
    return serializeValueToObjByFieldKey(fields, value)
  }, [value, fields])

  return useMemo(() => {
    const changedFields = new Set<string>()
    Object.keys(serializedFieldValues).forEach(fieldKey => {
      const isEqual = isDeepEqual( // Use const instead of let
        serializedFieldValues[fieldKey],
        serializedValuesFromItem[fieldKey]
      )
      if (!isEqual) {
        changedFields.add(fieldKey)
      }
    })

    const dataForUpdate: Record<string, unknown> = {}
    changedFields.forEach(fieldKey => {
      Object.assign(dataForUpdate, serializedFieldValues[fieldKey])
    })

    Object.keys(serializedFieldValues)
      .filter(fieldKey => fields[fieldKey].graphql?.isNonNull?.includes('update'))
      .filter(fieldKey => !changedFields.has(fieldKey))
      .forEach(fieldKey => {
        Object.assign(dataForUpdate, serializedFieldValues[fieldKey])
      })

    return { changedFields, dataForUpdate }
  }, [serializedFieldValues, serializedValuesFromItem, fields])
} 