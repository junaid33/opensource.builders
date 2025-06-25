/**
 * Client-side implementation for select fields
 */

"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getFilterTypes as getSelectFilterTypes, FilterTypes } from '../filterTypes'
import { FieldContainer } from "@/components/ui/field-container"
import { FieldLabel } from "@/components/ui/field-label"
import { FieldDescription } from "@/components/ui/field-description"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CellLink } from '@/features/dashboard/components/CellLink'

interface Option {
  value: string
  label: string
}

interface Field {
  path: string
  label: string
  description?: string
  options?: Option[]
  isRequired?: boolean
  displayMode?: 'select' | 'radio' | 'segmented-control'
  fieldMeta?: {
    options?: Array<{ value: any; label: string }>;
    isRequired?: boolean;
    type?: string;
    displayMode?: 'select' | 'radio' | 'segmented-control';
    defaultValue?: any;
    validation?: any;
    isNullable?: boolean;
  }
}

interface Value {
  value: Option | null;
  initial?: Option | null;
  kind?: 'create' | 'update';
}

interface FilterProps {
  value: string
  onChange: (value: string) => void
  operator: keyof FilterTypes
  field: Field
}

interface CellProps {
  item: Record<string, any>
  field: Field
  linkTo?: { href: string }
}

interface FieldProps {
  field: Field;
  value?: Value;
  onChange?: (value: Value) => void;
  autoFocus?: boolean;
  forceValidation?: boolean;
}

interface FilterLabelProps {
  label: string
  type: keyof FilterTypes
  value: string
}

// Field component for forms
export function Field({ field, value, onChange, autoFocus, forceValidation }: FieldProps) {
  const [hasChanged, setHasChanged] = useState(false);

  const validationMessage = (hasChanged || forceValidation) && !validate(value, field.isRequired || false) ? (
    <span className="text-red-600 dark:text-red-700 text-sm">
      {field.label} is required
    </span>
  ) : null;
  // Get options from fieldMeta
  const options = field?.options?.map(x => ({
    label: x.label,
    value: x.value.toString()
  })) || [];


  const displayMode = field?.displayMode || 'select';
  
  const renderContent = () => {
    if (displayMode === "select") {
      return (
        <>
          <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
          {field.description && <FieldDescription id={`${field.path}-description`}>
            {field.description}
          </FieldDescription>}
          <Select
            value={value?.value?.value}
            onValueChange={(newVal) => {
              const selectedOption = options.find(opt => opt.value === newVal);
              if (onChange && selectedOption) {
                onChange({
                  ...value,
                  value: selectedOption,
                  kind: value?.kind || 'create'
                });
                setHasChanged(true);
              }
            }}
            disabled={onChange === undefined}
          >
            <SelectTrigger id={field.path} autoFocus={autoFocus}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationMessage}
        </>
      );
    }

    if (displayMode === "radio") {
      return (
        <>
          <FieldLabel>{field.label}</FieldLabel>
          {field.description && <FieldDescription id={`${field.path}-description`}>
            {field.description}
          </FieldDescription>}
          <div>
            <RadioGroup
              value={value?.value?.value || ""}
              onValueChange={(newVal) => {
                const selectedOption = options.find(opt => opt.value === newVal);
                if (onChange && selectedOption) {
                  onChange({
                    ...value,
                    value: selectedOption,
                    kind: value?.kind || 'create'
                  });
                  setHasChanged(true);
                }
              }}
              disabled={onChange === undefined}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.path}-${option.value}`} />
                  <Label htmlFor={`${field.path}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {value?.value !== null && onChange !== undefined && !field.isRequired && (
              <Button
                onClick={() => {
                  onChange({
                    ...value,
                    value: null,
                    kind: value?.kind || 'create'
                  });
                  setHasChanged(true);
                }}
                className="mt-2"
                variant="secondary"
                size="sm"
              >
                Clear
              </Button>
            )}
          </div>
          {validationMessage}
        </>
      );
    }

    // segmented-control
    return (
      <>
        <FieldLabel>{field.label}</FieldLabel>
        {field.description && <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>}
        <div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={value?.value?.value ? (options.findIndex(x => x.value === value?.value?.value) ?? -1).toString() : undefined}
            onValueChange={(index) => {
              if (index !== undefined) {
                const selectedOption = options[parseInt(index)];
                onChange?.({
                  ...value,
                  value: selectedOption,
                  kind: value?.kind || 'create'
                });
                setHasChanged(true);
              }
            }}
            className="justify-start"
          >
            {options.map((option, index) => (
              <ToggleGroupItem key={option.value} value={index.toString()}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {value?.value !== null && onChange !== undefined && !field.isRequired && (
            <Button
              onClick={() => {
                onChange({
                  ...value,
                  value: null,
                  kind: value?.kind || 'create'
                });
                setHasChanged(true);
              }}
              className="mt-2"
              variant="destructive"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
        {validationMessage}
      </>
    );
  };
  
  return (
    <FieldContainer>
      {renderContent()}
    </FieldContainer>
  );
}

// Cell renderer for list view
export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path]
  if (value === null) return null

  const option = field.options?.find((opt) => opt.value === value)
  const content = option ? option.label : String(value);

  return linkTo ? (
    <CellLink href={linkTo.href}>
      {content}
    </CellLink>
  ) : content;
}

Cell.supportsLinkTo = true;

// Card value renderer for card view
export function CardValue({ item, field }: CellProps) {
  const value = item[field.path]
  const option = field.options?.find((opt) => opt.value === value)
  
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {option ? option.label : String(value)}
    </FieldContainer>
  );
}

// Filter component for select fields
export function Filter({ value, onChange, operator, field }: FilterProps) {
  const filterType = getSelectFilterTypes()[operator]
  
  if (!filterType) return null
  
  let values: string[]
  try {
    values = JSON.parse(value)
  } catch (e) {
    values = value ? [value] : []
  }
  
  const options = field.options || []
  
  if (operator === 'equals' || operator === 'not_equals') {
    return (
      <Select
        value={values[0] || ""}
        onValueChange={(newValue) => onChange(newValue)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  
  // For 'in' and 'not_in' operators, we use a different UI
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input 
            type="checkbox"
            id={`filter-${field.path}-${option.value}`}
            checked={values.includes(option.value)}
            onChange={(e) => {
              const checked = e.target.checked;
              const newValues = checked 
                ? [...values, option.value]
                : values.filter(v => v !== option.value);
              onChange(JSON.stringify(newValues));
            }}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label 
            htmlFor={`filter-${field.path}-${option.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

// Filter controller for select fields
export const filter = {
  Filter,
  types: getSelectFilterTypes(),
  Label: ({ label, type, value }: FilterLabelProps) => {
    const filterType = getSelectFilterTypes()[type]
    if (!filterType) return ""

    let values: string[]
    try {
      values = JSON.parse(value)
    } catch (e) {
      values = value ? [value] : []
    }

    return `${label} ${filterType.label.toLowerCase()}: ${values.join(", ")}`
  },
  graphql: ({ path, type, value }: { path: string; type: keyof FilterTypes; value: string[] | string }) => {
    // Handle array values (for 'in' and 'not_in' operators)
    if (Array.isArray(value)) {
      return {
        [path]: {
          [type === 'not_in' ? 'notIn' : 'in']: value
        }
      };
    }
    
    // Handle single values (for 'equals' and 'not_equals' operators)
    if (type === 'equals') {
      return { [path]: { equals: value } };
    }
    
    if (type === 'not_equals') {
      return { [path]: { not: { equals: value } } };
    }
    
    return {};
  }
}

/**
 * Validate a select field value
 */
function validate(value: Value | undefined, isRequired: boolean) {
  if (!isRequired) return true;
  if (!value) return false;
  
  // If this is an update and the initial value was null, we want to allow saving
  // since the user probably doesn't have read access control
  if (value.kind === 'update' && value.initial === null) return true;
  
  return value.value !== null;
}

/**
 * Controller for select fields
 */
export const controller = (config: {
  path: string
  label: string
  description?: string
  fieldMeta: {
    options: Array<{ value: any; label: string }>
    type?: 'string' | 'integer'
    displayMode?: 'select' | 'radio' | 'segmented-control'
    defaultValue?: any
    isRequired?: boolean
  }
}) => {
  const optionsWithStringValues = config.fieldMeta.options.map((x) => ({
    label: x.label,
    value: x.value.toString(),
  }));

  // Transform from string value to type appropriate value
  const t = (v: string | null) =>
    v === null ? null : config.fieldMeta.type === "integer" ? parseInt(v) : v;

  const stringifiedDefault = config.fieldMeta.defaultValue?.toString();

  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: {
      kind: "create" as const,
      value: optionsWithStringValues.find((x) => x.value === stringifiedDefault) ?? null,
    },
    type: config.fieldMeta.type,
    displayMode: config.fieldMeta.displayMode,
    isRequired: config.fieldMeta.isRequired,
    options: optionsWithStringValues,
    deserialize: (data: any) => {
      const value = data.get ? data.get(config.path).data : data[config.path];
      for (const option of config.fieldMeta.options) {
        if (option.value === value) {
          const stringifiedOption = {
            label: option.label,
            value: option.value.toString(),
          };
          return {
            kind: "update" as const,
            initial: stringifiedOption,
            value: stringifiedOption,
          };
        }
      }
      return { kind: "update" as const, initial: null, value: null };
    },
    serialize: (value: Value) => ({
      [config.path]: t(value.value?.value ?? null)
    }),
    validate: (value: Value) => validate(value, config.fieldMeta.isRequired || false),
    filter: {
      Filter,
      types: getSelectFilterTypes(),
      Label: ({ label, type, value }: FilterLabelProps) => {
        const filterType = getSelectFilterTypes()[type]
        if (!filterType) return ""

        let values: string[]
        try {
          values = JSON.parse(value)
        } catch (e) {
          values = value ? [value] : []
        }

        return `${label} ${filterType.label.toLowerCase()}: ${values.join(", ")}`
      },
      graphql: ({ path, type, value }: { path: string; type: keyof FilterTypes; value: string[] | string }) => {
        // Handle array values (for 'in' and 'not_in' operators)
        if (Array.isArray(value)) {
          return {
            [path]: {
              [type === 'not_in' ? 'notIn' : 'in']: value.map(v => t(v))
            }
          };
        }
        
        // Handle single values (for 'equals' and 'not_equals' operators)
        if (type === 'equals') {
          return { [path]: { equals: t(value as string) } };
        }
        
        if (type === 'not_equals') {
          return { [path]: { not: { equals: t(value as string) } } };
        }
        
        return {};
      }
    },
  };
};


