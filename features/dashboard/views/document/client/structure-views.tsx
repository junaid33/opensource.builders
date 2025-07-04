import { useEffect, useMemo, useRef } from 'react'
import type {
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
import { Label } from '@/components/ui/label'

import { getInitialPropsValue } from './DocumentEditor/component-blocks/initial-values'
import type { ComponentSchema } from './DocumentEditor/component-blocks/api'
import { assertNever, clientSideValidateProp } from './DocumentEditor/component-blocks/utils'
import { FormValueContentFromPreviewProps } from './DocumentEditor/component-blocks/form-from-preview'
import { createGetPreviewProps } from './DocumentEditor/component-blocks/preview-props'

export function Field({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation,
}: FieldProps<typeof controller>) {
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  })
  const createPreviewProps = useMemo(() => {
    return createGetPreviewProps(
      field.schema,
      getNewVal => {
        onChange?.({
          kind: valueRef.current.kind,
          value: getNewVal(valueRef.current.value),
        })
      },
      () => undefined
    )
  }, [field.schema, onChange])
  return (
    <div className="space-y-2">
      <Label htmlFor={field.path}>{field.label}</Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <FormValueContentFromPreviewProps
        autoFocus={autoFocus}
        forceValidation={forceValidation}
        {...createPreviewProps(value.value)}
      />
    </div>
  )
}

export const Cell: CellComponent<typeof controller> = () => {
  return null
}

export const allowedExportsOnCustomViews = ['schema']

export function controller(config: FieldControllerConfig): FieldController<{
  kind: 'create' | 'update'
  value: unknown
}> & {
  schema: ComponentSchema
} {
  if (!config.customViews.schema)
    throw new Error(
      `No schema in custom view. Did you forgot to set \`views\` to a file that exports a \`schema\` on ${config.listKey}.${config.path}`
    )
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} { json(hydrateRelationships: true) }`,
    schema: config.customViews.schema,
    defaultValue: { kind: 'create', value: getInitialPropsValue(config.customViews.schema) },
    validate: value => clientSideValidateProp(config.customViews.schema, value.value),
    deserialize: data => {
      return {
        kind: 'update',
        value: data[`${config.path}`]?.json ?? null,
      }
    },
    serialize: value => {
      return {
        [config.path]: serializeValue(config.customViews.schema, value.value, value.kind),
      }
    },
  }
}

function serializeValue(schema: ComponentSchema, value: any, kind: 'update' | 'create'): any {
  if (schema.kind === 'conditional') {
    return {
      [value.discriminant]: serializeValue(schema.values[value.discriminant], value.value, kind),
    }
  }
  if (schema.kind === 'array') {
    if (value === null) return []
    return value.map((x: any) => serializeValue(schema.element, x, kind))
  }
  if (schema.kind === 'form') return value
  if (schema.kind === 'object') {
    return Object.fromEntries(
      Object.entries(schema.fields).map(([key, val]) => {
        return [key, serializeValue(val, value[key], kind)]
      })
    )
  }
  if (schema.kind === 'relationship') {
    if (Array.isArray(value)) {
      return {
        [kind === 'create' ? 'connect' : 'set']: value.map(x => ({ id: x.id })),
      }
    }
    if (value === null) {
      if (kind === 'create') return
      return { disconnect: true }
    }
    return { connect: { id: value.id } }
  }
  if (schema.kind === 'child') {
    throw new Error('Child fields are not supported in the structure field')
  }
  assertNever(schema)
}
