/**
 * Client-side implementation for timestamp fields
 */
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FieldContainer } from "@/components/ui/field-container"
import { FieldLabel } from "@/components/ui/field-label"
import { FieldDescription } from "@/components/ui/field-description"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useFormattedInput } from "@/features/dashboard/lib/useFormattedInput"
import {
  constructTimestamp,
  deconstructTimestamp,
  formatOutput,
  parseTime,
  formatTime,
} from "./utils"
import { CellLink } from '@/features/dashboard/components/CellLink'
import { CalendarIcon } from "lucide-react"

interface Field {
  path: string
  label: string
  description?: string
  fieldMeta: {
    isRequired?: boolean
    defaultValue?: string | { kind: 'now' }
    updatedAt?: boolean
  }
}

interface FieldProps {
  field: Field
  value: {
    kind: 'create' | 'update'
    initial?: string | null
    value: {
      dateValue: string | null
      timeValue: { kind: 'parsed', value: string | null } | string
    }
  }
  onChange?: (value: any) => void
  forceValidation?: boolean
}

interface CellProps {
  item: Record<string, any>
  field: Field
  linkTo?: any
}

function validate(value: any, fieldMeta: any, label: string) {
  const val = value.value
  const hasDateValue = val.dateValue !== null
  const hasTimeValue =
    typeof val.timeValue === "string" ||
    typeof val.timeValue.value === "string"

  const isValueEmpty = !hasDateValue && !hasTimeValue

  if (value.kind === "update" && value.initial === null && isValueEmpty) {
    return undefined
  }

  if (
    value.kind === "create" &&
    isValueEmpty &&
    ((typeof fieldMeta.defaultValue === "object" &&
      fieldMeta.defaultValue?.kind === "now") ||
      fieldMeta.updatedAt)
  ) {
    return undefined
  }

  if (fieldMeta.isRequired && isValueEmpty) {
    return { date: `${label} is required` }
  }

  if (hasDateValue && !hasTimeValue) {
    return { time: `${label} requires a time to be provided` }
  }

  const timeError =
    typeof val.timeValue === "string"
      ? `${label} requires a valid time in the format hh:mm`
      : undefined

  if (hasTimeValue && !hasDateValue) {
    return { date: `${label} requires a date to be selected`, time: timeError }
  }

  if (timeError) {
    return { time: timeError }
  }

  return undefined
}

export function Field({ field, value, onChange, forceValidation }: FieldProps) {
  const [touchedFirstInput, setTouchedFirstInput] = useState(false)
  const [touchedSecondInput, setTouchedSecondInput] = useState(false)
  const showValidation = (touchedFirstInput && touchedSecondInput) || forceValidation

  const validationMessages = showValidation
    ? validate(value, field.fieldMeta, field.label)
    : undefined

  const timeInputProps = useFormattedInput<string | null>(
    {
      format({ value }) {
        if (value === null) {
          return ""
        }
        return formatTime(value)
      },
      parse(value) {
        value = value.trim()
        if (value === "") {
          return { kind: "parsed", value: null }
        }
        const parsed = parseTime(value)
        if (parsed !== undefined) {
          return { kind: "parsed", value: parsed }
        }
        return value
      },
    },
    {
      value: typeof value.value.timeValue === 'string' 
        ? value.value.timeValue 
        : value.value.timeValue.value,
      onChange(timeValue) {
        onChange?.({
          ...value,
          value: { ...value.value, timeValue: { kind: "parsed", value: timeValue } },
        })
      },
      onBlur() {
        setTouchedSecondInput(true)
      },
    }
  )

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>
        {field.description}
      </FieldDescription>
      {onChange ? (
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left h-11 text-base">
                  <CalendarIcon className="size-4 mr-2" />
                  {value.value.dateValue || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value.value.dateValue ? new Date(value.value.dateValue) : undefined}
                  onSelect={(date) => {
                    onChange({
                      ...value,
                      value: {
                        dateValue: date?.toISOString().split('T')[0] || null,
                        timeValue:
                          typeof value.value.timeValue === "object" &&
                          value.value.timeValue.value === null
                            ? { kind: "parsed", value: "00:00:00.000" }
                            : value.value.timeValue,
                      },
                    })
                    setTouchedFirstInput(true)
                  }}
                />
              </PopoverContent>
            </Popover>
            {validationMessages?.date && (
              <p className="text-sm text-destructive">{validationMessages.date}</p>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <Input
              id={`${field.path}--time-input`}
              {...timeInputProps}
              aria-describedby={`${field.path}-description`}
              disabled={onChange === undefined}
              placeholder="00:00"
              type="time"
              step="1"
            />
            {validationMessages?.time && (
              <p className="text-sm text-destructive">{validationMessages.time}</p>
            )}
          </div>
        </div>
      ) : (
        value.value.dateValue !== null &&
        typeof value.value.timeValue === "object" &&
        value.value.timeValue.value !== null && (
          <span>
            {formatOutput(
              constructTimestamp({
                dateValue: value.value.dateValue,
                timeValue: value.value.timeValue.value,
              })
            )}
          </span>
        )
      )}
      {((value.kind === "create" &&
        typeof field.fieldMeta.defaultValue !== "string" &&
        field.fieldMeta.defaultValue?.kind === "now") ||
        field.fieldMeta.updatedAt) && (
        <p className="text-sm text-muted-foreground">
          When this item is saved, this field will be set to the current date and time
        </p>
      )}
    </FieldContainer>
  )
}

export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  const content = (
    <div className="flex items-center">
      <span className="truncate">{formatOutput(value)}</span>
    </div>
  );

  return linkTo ? (
    <CellLink href={linkTo.href}>
      {content}
    </CellLink>
  ) : content;
}

Cell.supportsLinkTo = true;

export function CardValue({ item, field }: CellProps) {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {formatOutput(item[field.path])}
    </FieldContainer>
  )
}

export const controller = (config: Field) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: {
      kind: "create",
      value:
        typeof config.fieldMeta.defaultValue === "string"
          ? deconstructTimestamp(config.fieldMeta.defaultValue)
          : { dateValue: null, timeValue: { kind: "parsed", value: null } },
    },
    deserialize: (data: Record<string, any>) => {
      const value = data[config.path]
      return {
        kind: "update",
        initial: data[config.path],
        value: value
          ? deconstructTimestamp(value)
          : { dateValue: null, timeValue: { kind: "parsed", value: null } },
      }
    },
    serialize: ({ value: { dateValue, timeValue } }: any) => {
      if (
        dateValue &&
        typeof timeValue === "object" &&
        timeValue.value !== null
      ) {
        let formattedDate = constructTimestamp({
          dateValue,
          timeValue: timeValue.value,
        })
        return { [config.path]: formattedDate }
      }
      return { [config.path]: null }
    },
    validate: (value: any) =>
      validate(value, config.fieldMeta, config.label) === undefined,
  }
}

