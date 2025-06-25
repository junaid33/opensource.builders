/**
 * Client-side implementation for integer fields
 */

"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFilterTypes, formatFilterLabel } from '../filterTypes'
import Link from "next/link"
import { CellLink } from '@/features/dashboard/components/CellLink'

interface Field {
  path: string
  label: string
  description?: string
  fieldMeta?: {
    validation?: {
      min?: number
      max?: number
      isRequired?: boolean
    }
    defaultValue?: number | "autoincrement" | null
  }
}

interface FilterProps {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  operator: string
}

interface CellProps {
  item: Record<string, any>
  field: Field
  linkTo?: { href: string }
}

interface FieldProps {
  field: Field
  value?: { value: number | null; initial?: number | null; kind: 'update' | 'create' }
  onChange?: (value: { value: number | null; initial?: number | null; kind: 'update' | 'create' }) => void
  forceValidation?: boolean
  autoFocus?: boolean
}

interface Value {
  value: number | null
  initial?: number | null
  kind: 'update' | 'create'
}

/**
 * Filter component for integer fields
 */
export function Filter({ value, onChange, autoFocus, operator }: FilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (operator === "in" || operator === "not_in") {
      onChange(event.target.value.replace(/[^\d,\s-]/g, ""))
      return
    }
    onChange(event.target.value.replace(/[^\d\s-]/g, ""))
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      autoFocus={autoFocus}
      placeholder={(operator === "in" || operator === "not_in") ? "e.g. 1, 2, 3" : "Enter number..."}
      className="w-full"
    />
  )
}

/**
 * Cell renderer for list view
 */
export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  return linkTo ? (
    <CellLink href={linkTo.href}>
      {value}
    </CellLink>
  ) : value;
}

Cell.supportsLinkTo = true;

/**
 * Card value renderer for detail view
 */
export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  if (value === null || value === undefined) {
    return null;
  }
  
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      <div className="font-mono">
        {value.toLocaleString()}
      </div>
    </div>
  )
}

/**
 * Form field component
 */
export function Field({ field, value, onChange, forceValidation, autoFocus }: FieldProps) {
  const [hasBlurred, setHasBlurred] = useState(false);
  const validation = field.fieldMeta?.validation || {};
  const hasAutoIncrementDefault = field.fieldMeta?.defaultValue === "autoincrement";
  
  // Validate the current value
  const validationMessage = validate(
    value || { kind: 'create', value: null },
    validation,
    field.label,
    hasAutoIncrementDefault
  );
  
  // Format the input value
  const inputValue = value?.value === null ? "" : String(value?.value || "");
  
  // Handle input change with formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    let parsedValue: number | null = null;
    
    if (raw !== "") {
      if (/^[+-]?\d+$/.test(raw)) {
        const parsed = parseInt(raw, 10);
        if (Number.isSafeInteger(parsed)) {
          parsedValue = parsed;
        }
      }
    }
    
    onChange?.({
      kind: value?.kind || "update",
      value: parsedValue,
      initial: value?.initial,
    });
  };
  
  return (
    <div className="grid gap-1">
      <Label htmlFor={field.path}>{field.label}</Label>
      <Input
        id={field.path}
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={() => setHasBlurred(true)}
        autoFocus={autoFocus}
        inputMode="numeric"
        min={validation?.min}
        max={validation?.max}
        placeholder={
          hasAutoIncrementDefault && value?.kind === "create"
            ? "Defaults to an incremented number"
            : undefined
        }
      />
      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
      {(hasBlurred || forceValidation) && validationMessage && (
        <p className="text-destructive text-sm">{validationMessage}</p>
      )}
    </div>
  )
}

/**
 * Validation function for integer fields
 */
function validate(
  value: Value, 
  validation: any, 
  label: string,
  hasAutoIncrementDefault: boolean = false
): string | undefined {
  const val = value.value;
  
  if (typeof val === "string") {
    return `${label} must be a whole number`;
  }

  // If we receive null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === "update" && value.initial === null && val === null) {
    return undefined;
  }

  if (value.kind === "create" && val === null && hasAutoIncrementDefault) {
    return undefined;
  }

  if (validation?.isRequired && val === null && !hasAutoIncrementDefault) {
    return `${label} is required`;
  }
  
  if (typeof val === "number") {
    if (!Number.isInteger(val)) {
      return `${label} must be a whole number`;
    }
    
    if (validation?.min !== undefined && val < validation.min) {
      return `${label} must be greater than or equal to ${validation.min}`;
    }
    
    if (validation?.max !== undefined && val > validation.max) {
      return `${label} must be less than or equal to ${validation.max}`;
    }
  }

  return undefined;
}

/**
 * Filter controller for integer fields
 */
export const filter = {
  Filter,
  types: getFilterTypes(),
  Label: ({ label, type, value }: { label: string, type: string, value: string }) => {
    let renderedValue = value;
    if (["in", "not_in"].includes(type)) {
      renderedValue = value
        .split(",")
        .map(value => value.trim())
        .join(", ");
    }
    return `${label.toLowerCase()}: ${renderedValue}`;
  },
  graphql: ({ path, type, value }: { path: string, type: string, value: string }) => {
    const valueWithoutWhitespace = value.replace(/\s/g, "");
    const parsed =
      type === "in" || type === "not_in"
        ? valueWithoutWhitespace.split(",").map(x => parseInt(x, 10))
        : parseInt(valueWithoutWhitespace, 10);
    
    if (type === "not") {
      return { [path]: { not: { equals: parsed } } };
    }
    
    const key =
      type === "is" ? "equals" : 
      type === "not_in" ? "notIn" : 
      type;
    
    return { [path]: { [key]: parsed } };
  }
}

/**
 * Controller for integer fields
 */
export const controller = (field: Field) => {
  const fieldMeta = field.fieldMeta || {};
  const validation = fieldMeta.validation || {};
  const hasAutoIncrementDefault = fieldMeta.defaultValue === "autoincrement";
  
  return {
    path: field.path,
    label: field.label,
    description: field.description,
    graphqlSelection: field.path,
    validation: validation,
    defaultValue: {
      kind: "create" as const,
      value: hasAutoIncrementDefault ? null : fieldMeta.defaultValue
    },
    deserialize: (data: any) => {
      const value = data.get ? data.get(field.path).data : data[field.path];
      return {
        kind: "update" as const,
        value: value,
        initial: value
      };
    },
    serialize: (value: Value) => ({ 
      [field.path]: value.value 
    }),
    hasAutoIncrementDefault,
    validate: (value: Value) =>
      validate(
        value,
        validation,
        field.label,
        hasAutoIncrementDefault
      ) === undefined,
    filter
  }
}

