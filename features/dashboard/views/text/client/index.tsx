/**
 * Client-side implementation for text fields
 */

"use client"

import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldContainer } from "@/components/ui/field-container"
import { FieldLabel } from "@/components/ui/field-label"
import { FieldDescription } from "@/components/ui/field-description"
import { TextInput } from "@/components/ui/text-input"
import { Textarea } from "@/components/ui/textarea"
import { CellLink } from '@/features/dashboard/components/CellLink'

interface Field {
  path: string
  label: string
  description?: string
  validation?: {
    isRequired?: boolean
    length?: { min: number | null; max: number | null }
    match?: { regex: RegExp; explanation?: string }
  }
  displayMode?: "input" | "textarea"
  isNullable?: boolean
}

interface Value {
  kind?: 'update' | 'create'
  initial?: { kind: 'value' | 'null'; value?: string; prev?: string }
  inner: { kind: "value"; value: string } | { kind: "null"; prev: string }
}

interface FilterProps {
  value: string
  onChange: (value: string) => void
}

interface CellProps {
  item: Record<string, any>
  field: Field
  linkTo?: {
    href: string
  }
}

interface FilterLabelProps {
  label: string
  type: keyof FilterTypes
  value: string
}

interface GraphQLProps {
  path: string
  type: keyof FilterTypes
  value: string
}

interface FilterType {
  label: string
  initialValue: string
}

interface FilterTypes {
  contains_i: FilterType
  not_contains_i: FilterType
  equals_i: FilterType
  not_equals_i: FilterType
  starts_with_i: FilterType
  not_starts_with_i: FilterType
  ends_with_i: FilterType
  not_ends_with_i: FilterType
}

interface FieldProps {
  field: Field
  value: Value
  onChange?: (value: Value) => void
  autoFocus?: boolean
  forceValidation?: boolean
}

function validate(value: Value, validation?: any, label?: string): string[] {
  // if the value is the same as the initial for an update, we don't want to block saving
  // since we're not gonna send it anyway if it's the same
  // and going "fix this thing that is unrelated to the thing you're doing" is bad
  // and also bc it could be null bc of read access control

  console.log("value33333", {value, validation, label})
  if (
    value.kind === "update" &&
    value.initial &&
    ((value.initial.kind === "null" && value.inner.kind === "null") ||
      (value.initial.kind === "value" &&
        value.inner.kind === "value" &&
        value.inner.value === value.initial.value))
  ) {
    return [];
  }

  if (!validation) return [];
  
  if (value.inner.kind === "null") {
    if (validation.isRequired) {
      return [`${label} is required`];
    }
    return [];
  }

  const val = value.inner.value;

  let messages: string[] = [];
  if (validation.length && validation.length.min !== null && val.length < validation.length.min) {
    if (validation.length.min === 1) {
      messages.push(`${label} must not be empty`);
    } else {
      messages.push(
        `${label} must be at least ${validation.length.min} characters long`
      );
    }
  }
  if (validation.length && validation.length.max !== null && val.length > validation.length.max) {
    messages.push(
      `${label} must be no longer than ${validation.length.max} characters`
    );
  }
  if (validation.match && !validation.match.regex.test(val)) {
    messages.push(
      validation.match.explanation ||
        `${label} must match ${validation.match.regex}`
    );
  }
  return messages;
}

export function Field({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation,
}: FieldProps) {
  const [shouldShowErrors, setShouldShowErrors] = useState(false)
  const validationMessages = validate(value, field.validation || (field as any).fieldMeta?.validation, field.label)
  const showValidationErrors = (shouldShowErrors || forceValidation) && !!validationMessages.length;

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      {field.description && <FieldDescription id={`${field.path}-description`}>
        {field.description}
      </FieldDescription>}
      {onChange ? (
        <div>
          {field.displayMode === "textarea" ? (
            <Textarea
              id={field.path}
              autoFocus={autoFocus}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange({
                  ...value,
                  inner: { kind: "value", value: event.target.value },
                })
              }
              value={value.inner.kind === "null" ? "" : value.inner.value}
              disabled={value.inner.kind === "null"}
              onBlur={() => {
                setShouldShowErrors(true)
              }}
              aria-describedby={
                field.description === null
                  ? undefined
                  : `${field.path}-description`
              }
              aria-invalid={showValidationErrors}
            />
          ) : (
            <TextInput
              id={field.path}
              autoFocus={autoFocus}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...value,
                  inner: { kind: "value", value: event.target.value },
                })
              }
              value={value.inner.kind === "null" ? "" : value.inner.value}
              disabled={value.inner.kind === "null"}
              onBlur={() => {
                setShouldShowErrors(true)
              }}
              aria-describedby={
                field.description === null
                  ? undefined
                  : `${field.path}-description`
              }
              aria-invalid={showValidationErrors}
            />
          )}
          {field.isNullable && (
            <Checkbox
              autoFocus={autoFocus}
              disabled={onChange === undefined}
              onChange={() => {
                if (value.inner.kind === "value") {
                  onChange({
                    ...value,
                    inner: {
                      kind: "null",
                      prev: value.inner.value,
                    },
                  })
                } else {
                  onChange({
                    ...value,
                    inner: {
                      kind: "value",
                      value: value.inner.prev,
                    },
                  })
                }
              }}
              checked={value.inner.kind === "null"}
            >
              <span>Set field as null</span>
            </Checkbox>
          )}
          {showValidationErrors && validationMessages.map((message, i) => (
            <span key={i} className="text-red-600 dark:text-red-700 text-sm">
              {message}
            </span>
          ))}
        </div>
      ) : value.inner.kind === "null" ? null : (
        value.inner.value
      )}
    </FieldContainer>
  )
}

// Filter component for text fields
export function Filter({ value, onChange }: FilterProps) {
  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="h-8"
    />
  )
}

// Get available filter types for text fields
export function getFilterTypes(): FilterTypes {
  return {
    contains_i: {
      label: "Contains",
      initialValue: "",
    },
    not_contains_i: {
      label: "Does not contain", 
      initialValue: "",
    },
    equals_i: {
      label: "Equals",
      initialValue: "",
    },
    not_equals_i: {
      label: "Does not equal",
      initialValue: "",
    },
    starts_with_i: {
      label: "Starts with",
      initialValue: "",
    },
    not_starts_with_i: {
      label: "Does not start with",
      initialValue: "",
    },
    ends_with_i: {
      label: "Ends with",
      initialValue: "",
    },
    not_ends_with_i: {
      label: "Does not end with",
      initialValue: "",
    }
  }
}

// Cell renderer for list view
export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  const content = (
    <div className="flex items-center">
      <span className="truncate">{value || <span className="text-muted-foreground">No value</span>}</span>
    </div>
  );

  return linkTo ? (
    <CellLink href={linkTo.href}>
      {content}
    </CellLink>
  ) : content;
}

Cell.supportsLinkTo = true;

// Card value renderer for card view
export function CardValue({ item, field }: CellProps) {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  );
}

// Filter controller for text fields
export const filter = {
  Filter,
  types: getFilterTypes(),
  Label: ({ label, value }: FilterLabelProps) => {
    return `${label.toLowerCase()}: "${value}"`
  }
}

// Helper function to deserialize text value - matches the old Keystone implementation
function deserializeTextValue(value: any): { kind: "value"; value: any } | { kind: "null"; prev: string } {
  if (value === null) {
    return { kind: "null", prev: "" };
  }
  return { kind: "value", value };
}

/**
 * Controller for text fields
 */
export const controller = (config: {
  path: string
  label: string
  description?: string
  fieldMeta?: {
    isRequired?: boolean
    displayMode?: "input" | "textarea"
    defaultValue?: any
    validation?: {
      isRequired?: boolean
      length?: { min: number | null; max: number | null }
      match?: { regex: RegExp; explanation?: string }
    }
    isNullable?: boolean
  }
}) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: {
      kind: "create" as const,
      inner: deserializeTextValue(config.fieldMeta?.defaultValue || ""),
    },
    deserialize: (data: any) => {
      const value = data.get ? data.get(config.path).data : data[config.path];
      const inner = deserializeTextValue(value);
      return { kind: "update" as const, inner, initial: inner };
    },
    serialize: (value: Value) => ({
      [config.path]: value.inner.kind === "null" ? null : value.inner.value
    }),
    validate: (value: Value) => {
      return validate(value, config.fieldMeta?.validation, config.label).length === 0
    },
    filter: {
      Filter,
      types: getFilterTypes(),
      Label: ({ label, value }: FilterLabelProps) => {
        return `${label.toLowerCase()}: "${value}"`
      },
      graphql: ({ type, value }: GraphQLProps) => {
        const isNot = type.startsWith("not_")
        const key = type === "equals_i" || type === "not_equals_i"
          ? "equals"
          : type.replace(/_i$/, "").replace("not_", "").replace(/_([a-z])/g, (_, char) => char.toUpperCase())
        
        const filter = { [key]: value }
        return {
          [config.path]: {
            ...(isNot ? { not: filter } : filter),
            mode: "insensitive"
          },
        }
      },
    },
  }
}

