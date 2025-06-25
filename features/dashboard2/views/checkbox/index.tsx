/**
 * Checkbox field view - Keystone implementation with Shadcn UI
 */

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { entriesTyped } from '../../lib/entriesTyped'
import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '../../types'

interface CheckboxFieldProps {
  field: {
    path: string
    label: string
    description?: string
  }
  value: boolean
  onChange?: (value: boolean) => void
  autoFocus?: boolean
}

interface CellProps {
  item: Record<string, any>
  field: any
  value?: boolean
}

export function Field({ field, value, onChange, autoFocus }: CheckboxFieldProps) {
  const isReadOnly = onChange == null

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.path}
        checked={value}
        onCheckedChange={onChange}
        disabled={isReadOnly}
        autoFocus={autoFocus}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={field.path}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {field.label}
        </Label>
        {field.description && (
          <p className="text-xs text-muted-foreground">
            {field.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function Cell({ item, field, value }: CellProps) {
  const fieldValue = value ?? item[field.path]
  return (
    <div className="flex items-center justify-center">
      {fieldValue ? (
        <Check className="h-4 w-4 text-green-600" aria-label="true" />
      ) : (
        <span className="sr-only">false</span>
      )}
    </div>
  )
}

export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  return (
    <div>
      <div className="text-sm font-medium">{field.label}</div>
      <div className="text-sm text-muted-foreground">
        {value ? 'True' : 'False'}
      </div>
    </div>
  )
}

type CheckboxController = FieldController<boolean>

export function controller(
  config: FieldControllerConfig<{ defaultValue: boolean }>
): CheckboxController {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: config.fieldMeta?.defaultValue ?? false,
    deserialize(item) {
      const value = item[config.path]
      return typeof value === 'boolean' ? value : false
    },
    serialize(value) {
      return { [config.path]: value }
    },
    validate: () => true,
    filter: {
      Filter: ({ value, onChange, autoFocus }: any) => (
        <Checkbox
          autoFocus={autoFocus}
          checked={value}
          onCheckedChange={onChange}
        />
      ),
      Label: ({ label, value }: { label: string; value: boolean }) => {
        return `${label.toLowerCase()} ${value ? 'true' : 'false'}`
      },
      graphql: ({ type, value }: { type: string; value: boolean }) => {
        return {
          [config.path]: {
            equals: type === 'not' ? !value : value,
          },
        }
      },
      parseGraphQL: (value: any) => {
        return entriesTyped(value).flatMap(([type, value]) => {
          if (value == null) return []
          if (type === 'equals') return { type: 'is', value }
          if (type === 'not') {
            if (value.equals == null) return []
            return { type: 'not', value: value.equals }
          }
          return []
        })
      },
      types: {
        is: {
          label: 'Is',
          initialValue: true,
        },
        not: {
          label: 'Is not',
          initialValue: true,
        },
      },
    },
  }
}

Cell.supportsLinkTo = false