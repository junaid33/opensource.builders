"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFilterTypes } from '../filterTypes'
import { CellLink } from '@/features/dashboard/components/CellLink'

interface CellProps {
  item: any
  field: {
    path: string
    label: string
  }
  linkTo?: {
    href: string
  }
}

interface FilterProps {
  type?: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

interface ControllerConfig {
  path: string
  label: string
  description?: string
  fieldMeta?: {
    kind?: string
  }
}

interface GraphQLProps {
  type: string
  value: string
}

interface FilterLabelProps {
  label: string
  value: string
  type: string
}

// Add placeholder Field component since it's not implemented yet
export const Field = () => null

/**
 * Filter component for ID fields
 */
export function Filter({ value, onChange, autoFocus, type }: FilterProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      placeholder={type === "in" || type === "not_in" ? "e.g. id1, id2, id3" : "Enter ID..."}
      className="w-full"
    />
  )
}

/**
 * Cell component for rendering ID values in a list view
 */
export function Cell({ item, field, linkTo }: CellProps) {
  let value = item[field.path] + ""
  return linkTo ? (
    <CellLink href={linkTo.href}>
      {value}
    </CellLink>
  ) : (
    <div>{value}</div>
  )
}

Cell.supportsLinkTo = true

export function CardValue({ item, field }: CellProps) {
  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <div>{item[field.path]}</div>
    </div>
  )
}

export const controller = (config: ControllerConfig) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    idFieldKind: config.fieldMeta?.kind,
    defaultValue: null,
    deserialize: (data: any) => {
      const value = data.get ? data.get(config.path).data : data[config.path];
      return value;
    },
    serialize: (value: any) => ({ [config.path]: value })
  }
}

