/**
 * Client-side implementation for decimal fields
 */

"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFilterTypes, formatFilterLabel } from '../filterTypes'
import { CellLink } from '@/features/dashboard/components/CellLink'
import { FieldContainer } from "@/components/ui/field-container"
import { FieldLabel } from "@/components/ui/field-label"
import { FieldDescription } from "@/components/ui/field-description"

// Simple Decimal-like class for client-side operations
class SimpleDecimal {
  private value: string

  constructor(value: string | number | null) {
    if (value === null || value === undefined) {
      this.value = '0'
    } else {
      this.value = String(value)
    }
  }

  toString(): string {
    return this.value
  }

  toNumber(): number {
    return parseFloat(this.value)
  }

  isFinite(): boolean {
    return isFinite(this.toNumber())
  }

  lessThan(other: SimpleDecimal): boolean {
    return this.toNumber() < other.toNumber()
  }

  greaterThan(other: SimpleDecimal): boolean {
    return this.toNumber() > other.toNumber()
  }

  static isValid(value: string): boolean {
    try {
      const num = parseFloat(value)
      return !isNaN(num) && isFinite(num)
    } catch {
      return false
    }
  }
}

interface Field {
  path: string
  label: string
  description?: string
  fieldMeta?: {
    validation?: {
      min?: string
      max?: string
      isRequired?: boolean
    }
    defaultValue?: string | null
    precision?: number
    scale?: number
  }
}

interface FilterProps {
  type?: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

interface CellProps {
  item: Record<string, any>
  field: Field
  linkTo?: { href: string }
}

interface FieldProps {
  field: Field
  value?: { value: string | null; initial?: string | null; kind: 'update' | 'create' }
  onChange?: (value: { value: string | null; initial?: string | null; kind: 'update' | 'create' }) => void
  forceValidation?: boolean
  autoFocus?: boolean
}

interface Value {
  value: string | null
  initial?: string | null
  kind: 'update' | 'create'
}

/**
 * Filter component for decimal fields
 */
export function Filter({ type, value, onChange, autoFocus }: FilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    // For list operators (in, not_in), allow commas and decimals
    if (type === "in" || type === "not_in") {
      onChange(newValue.replace(/[^\d.,\s-]/g, ""))
      return
    }

    // For single value operators, only allow decimals
    onChange(newValue.replace(/[^\d.\s-]/g, ""))
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      autoFocus={autoFocus}
      placeholder={type === "in" || type === "not_in" ? "e.g. 1.50, 2.75, 3.00" : "e.g. 123.45"}
      className="w-full"
    />
  )
}

/**
 * Cell renderer for list view
 */
export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  
  // Format the decimal value with proper precision
  const formattedValue = (() => {
    if (value === null || value === undefined) return value
    
    try {
      const decimal = new SimpleDecimal(value)
      const scale = field.fieldMeta?.scale || 4
      return parseFloat(decimal.toString()).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: scale,
      })
    } catch {
      return value
    }
  })()

  const content = <div className="font-mono">{formattedValue}</div>

  return linkTo ? (
    <CellLink href={linkTo.href}>
      {content}
    </CellLink>
  ) : content
}

Cell.supportsLinkTo = true

/**
 * Card value renderer for detail view
 */
export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  
  if (value === null || value === undefined) {
    return null
  }
  
  // Format the decimal value with proper precision
  const formattedValue = (() => {
    try {
      const decimal = new SimpleDecimal(value)
      const scale = field.fieldMeta?.scale || 4
      return parseFloat(decimal.toString()).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: scale,
      })
    } catch {
      return value
    }
  })()
  
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      <div className="font-mono">
        {formattedValue}
      </div>
    </div>
  )
}

/**
 * Form field component
 */
export function Field({ field, value, onChange, forceValidation, autoFocus }: FieldProps) {
  const [hasBlurred, setHasBlurred] = useState(false)
  const validation = field.fieldMeta?.validation || {}
  
  // Validate the current value
  const validationMessage = validate(
    value || { kind: 'create', value: null },
    validation,
    field.label
  )
  
  // Format the input value
  const inputValue = value?.value === null ? "" : String(value?.value || "")
  
  // Handle input change with decimal formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim()
    let parsedValue: string | null = null
    
    if (raw !== "") {
      // Allow decimal numbers with optional negative sign
      if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(raw)) {
        if (SimpleDecimal.isValid(raw)) {
          parsedValue = raw
        }
      }
    }
    
    onChange?.({
      kind: value?.kind || "update",
      value: parsedValue,
      initial: value?.initial,
    })
  }
  
  const scale = field.fieldMeta?.scale || 4
  
  return (
    <div className="grid gap-1">
      <Label htmlFor={field.path}>{field.label}</Label>
      <Input
        id={field.path}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={() => setHasBlurred(true)}
        autoFocus={autoFocus}
        inputMode="decimal"
        step={`0.${'0'.repeat(scale - 1)}1`}
        placeholder="0.00"
      />
      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
      {(hasBlurred || forceValidation) && validationMessage && (
        <p className="text-destructive text-sm">{validationMessage}</p>
      )}
    </div>
  )
}

/**
 * Validation function for decimal fields
 */
function validate(
  value: Value, 
  validation: any, 
  label: string
): string | undefined {
  const val = value.value
  
  // If we receive null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === "update" && value.initial === null && val === null) {
    return undefined
  }

  if (validation?.isRequired && val === null) {
    return `${label} is required`
  }
  
  if (typeof val === "string") {
    try {
      const decimal = new SimpleDecimal(val)
      if (!decimal.isFinite()) {
        return `${label} is not finite`
      }
      
      if (validation?.min !== undefined) {
        const minDecimal = new SimpleDecimal(validation.min)
        if (decimal.lessThan(minDecimal)) {
          return `${label} must be greater than or equal to ${validation.min}`
        }
      }
      
      if (validation?.max !== undefined) {
        const maxDecimal = new SimpleDecimal(validation.max)
        if (decimal.greaterThan(maxDecimal)) {
          return `${label} must be less than or equal to ${validation.max}`
        }
      }
    } catch (e: any) {
      return e?.message ?? `${label} must be a valid decimal number`
    }
  }

  return undefined
}

/**
 * Filter controller for decimal fields
 */
export const filter = {
  Filter,
  types: getFilterTypes(),
  Label: ({ label, type, value }: { label: string, type: string, value: string }) => {
    let renderedValue = value
    if (["in", "not_in"].includes(type)) {
      renderedValue = value
        .split(",")
        .map(value => value.trim())
        .join(", ")
    }
    return `${label.toLowerCase()}: ${renderedValue}`
  },
  graphql: ({ path, type, value }: { path: string, type: string, value: string }) => {
    const valueWithoutWhitespace = value.replace(/\s/g, "")
    const parsed =
      type === "in" || type === "not_in"
        ? valueWithoutWhitespace.split(",").map(x => x.trim())
        : valueWithoutWhitespace
    
    if (type === "not") {
      return { [path]: { not: { equals: parsed } } }
    }
    
    const key =
      type === "is" ? "equals" : 
      type === "not_in" ? "notIn" : 
      type
    
    return { [path]: { [key]: parsed } }
  }
}

/**
 * Controller for decimal fields
 */
export const controller = (field: Field) => {
  const fieldMeta = field.fieldMeta || {}
  const validation = fieldMeta.validation || {}
  
  return {
    path: field.path,
    label: field.label,
    description: field.description,
    graphqlSelection: field.path,
    validation: validation,
    defaultValue: {
      kind: "create" as const,
      value: fieldMeta.defaultValue
    },
    deserialize: (data: any) => {
      const value = data.get ? data.get(field.path).data : data[field.path]
      return {
        kind: "update" as const,
        value: value,
        initial: value
      }
    },
    serialize: (value: Value) => ({ 
      [field.path]: value.value 
    }),
    validate: (value: Value) =>
      validate(
        value,
        validation,
        field.label
      ) === undefined,
    filter
  }
}