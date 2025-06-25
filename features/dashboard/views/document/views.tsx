'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import type { CellComponent, FieldProps } from '@keystone-6/core/types'
import { Node } from 'slate'

// Import from client folder instead of directly from DocumentEditor
import { DocumentEditor } from './client/DocumentEditor'
import { ForceValidationProvider } from './client/DocumentEditor/utils-hooks'
import { type DocumentFeatures, controller } from './client'

// Re-export from client folder
export { Cell as ClientCell, CardValue, Field as ClientField, controller } from './client'
export { type DocumentFeatures }

export function Field(props: FieldProps<typeof controller>) {
  const { autoFocus, field, forceValidation, onChange, value } = props

  return (
    <div className="space-y-2">
      <Label htmlFor={field.path}>{field.label}</Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <ForceValidationProvider value={!!forceValidation}>
        <DocumentEditor
          // inputProps from KeystarField are not directly applicable here
          id={field.path} // Added id for label association
          autoFocus={autoFocus}
          componentBlocks={field.componentBlocks}
          documentFeatures={field.documentFeatures}
          onChange={onChange}
          relationships={field.relationships}
          value={value}
        />
      </ForceValidationProvider>
    </div>
  )
}

function serialize(nodes: Node[]) {
  return nodes.map((n: Node) => Node.string(n)).join('\n')
}

export const Cell: CellComponent<typeof controller> = ({ item, field }) => {
  const value = item[field.path]?.document
  if (!value) return null
  return <span className="text-sm">{serialize(value).slice(0, 60)}</span>
}

export const allowedExportsOnCustomViews = ['componentBlocks']
