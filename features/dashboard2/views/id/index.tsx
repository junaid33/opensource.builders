/**
 * ID field view - Read-only identifier field
 */

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Hash } from 'lucide-react'
import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '../../types'

interface IdFieldProps {
  field: {
    path: string
    label: string
    description?: string
    kind: 'autoincrement' | 'uuid' | 'cuid'
  }
  value: string
  onChange?: never // ID fields are always read-only
  autoFocus?: boolean
  forceValidation?: boolean
}

interface CellProps {
  item: Record<string, any>
  field: any
}

export function Field({
  field,
  value,
  autoFocus,
}: IdFieldProps) {
  const displayValue = value || (field.kind === 'autoincrement' ? 'Auto-generated' : 'Generated on save')

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={displayValue}
          className="bg-muted font-mono"
          autoFocus={autoFocus}
        />
        <Badge variant="secondary" className="flex items-center gap-1">
          <Hash className="w-3 h-3" />
          {field.kind}
        </Badge>
      </div>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <p className="text-xs text-muted-foreground">
        This field is automatically managed and cannot be edited.
      </p>
    </div>
  )
}

export function Cell({ item, field }: CellProps) {
  const value = item[field.path]
  return (
    <div className="flex items-center gap-1">
      <Hash className="w-3 h-3 text-muted-foreground" />
      <span className="text-sm font-mono">
        {value || '—'}
      </span>
    </div>
  )
}

export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  return (
    <div>
      <div className="text-sm font-medium">{field.label}</div>
      <div className="text-sm text-muted-foreground">
        {value ? (
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span className="font-mono">{value}</span>
          </div>
        ) : (
          '—'
        )}
      </div>
    </div>
  )
}

type IdFieldMeta = {
  kind: 'autoincrement' | 'uuid' | 'cuid'
}

export function controller(
  config: FieldControllerConfig<IdFieldMeta>
): FieldController<string> & {
  kind: 'autoincrement' | 'uuid' | 'cuid'
} {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    kind: config.fieldMeta?.kind || 'autoincrement',
    defaultValue: '',
    deserialize: data => data[config.path] || '',
    serialize: () => ({}), // ID fields are never serialized for updates
    validate: () => true, // ID fields don't need validation
  }
}

Cell.supportsLinkTo = true