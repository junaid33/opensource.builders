"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFilterTypes, formatFilterLabel } from '../filterTypes'
import { CellLink } from '@/features/dashboard/components/CellLink'
import { FieldContainer } from "@/components/ui/field-container"
import { FieldLabel } from "@/components/ui/field-label"
import { FieldDescription } from "@/components/ui/field-description"

interface Field {
  path: string
  label: string
  description?: string
  validation?: {
    min?: number
    max?: number
    precision?: number
    isRequired?: boolean
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
  value?: { value: number | null; initial?: number | null; kind: 'update' | 'create' }
  onChange?: (value: { value: number | null; initial?: number | null; kind: 'update' | 'create' }) => void
}

/**
 * Filter component for float fields
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
      placeholder={type === "in" || type === "not_in" ? "e.g. 1.5, 2.7, 3.0" : "e.g. 1.5"}
      className="w-full"
    />
  )
}

/**
 * Cell component for rendering float values in a list view
 */
export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  // Format the float value to a reasonable number of decimal places
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : value

  const content = <div className="font-mono">{formattedValue}</div>;

  return linkTo ? (
    <CellLink href={linkTo.href}>
      {content}
    </CellLink>
  ) : content;
}

Cell.supportsLinkTo = true;

export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  // Format the float value to a reasonable number of decimal places
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : value

  return (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      <div className="font-mono">{formattedValue}</div>
    </div>
  )
}

export function Field({ field, value, onChange }: FieldProps) {
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <Input
        id={field.path}
        type="number"
        step="any"
        value={value?.value ?? ""}
        onChange={(e) => {
          const val = e.target.value === "" ? null : Number.parseFloat(e.target.value)
          onChange?.({
            kind: value?.kind || "update",
            value: val,
            initial: value?.initial,
          })
        }}
        min={field.validation?.min}
        max={field.validation?.max}
      />
      {field.description && (
        <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>
      )}
    </FieldContainer>
  )
}

function validate(value: any, validation: any, label: string) {
  const val = value.value;

  // if we recieve null initially on the item view and the current value is null,
  // we should always allow saving it because:
  // - the value might be null in the database and we don't want to prevent saving the whole item because of that
  // - we might have null because of an access control error
  if (value.kind === "update" && value.initial === null && val === null) {
    return undefined;
  }

  if (value.kind === "create" && value.value === null) {
    return undefined;
  }

  if (validation.isRequired && val === null) {
    return `${label} is required`;
  }

  // we don't parse infinite numbers into +-Infinity/NaN so that we don't lose the text that the user wrote
  // so we need to try parsing it again here to provide good messages
  if (typeof val === "string") {
    const number = parseFloat(val);
    if (isNaN(number)) {
      return `${label} must be a number`;
    }
    return `${label} must be finite`;
  }

  if (typeof val === "number") {
    if (typeof validation?.min === "number" && val < validation.min) {
      return `${label} must be greater than or equal to ${validation.min}`;
    }
    if (typeof validation?.max === "number" && val > validation?.max) {
      return `${label} must be less than or equal to ${validation.max}`;
    }
  }

  return undefined;
}

interface ControllerConfig {
  path: string;
  label: string;
  description?: string;
  fieldMeta: {
    validation?: {
      isRequired?: boolean;
      min?: number;
      max?: number;
      precision?: number;
    };
    defaultValue?: number | null;
  };
}

export const controller = (config: ControllerConfig) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    validation: config.fieldMeta.validation,
    defaultValue: {
      kind: "create" as const,
      value: config.fieldMeta.defaultValue,
    },
    deserialize: (data: Record<string, any>) => ({
      kind: "update" as const,
      initial: data[config.path],
      value: data[config.path],
    }),
    serialize: (value: { value: number | null; initial?: number | null }) => ({ [config.path]: value.value }),
    validate: (value: { value: number | null; initial?: number | null }) =>
      validate(value, config.fieldMeta.validation, config.label) === undefined
  };
};

