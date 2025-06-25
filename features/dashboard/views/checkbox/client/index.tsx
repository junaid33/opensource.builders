"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldDescription } from "@/components/ui/field-description";
import { getFilterTypes as getFilterTypesFromModule } from '../filterTypes';

interface Field {
  path: string;
  label: string;
  description?: string;
  fieldMeta: {
    defaultValue?: boolean;
  };
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  operator?: string;
}

interface CellProps {
  item: Record<string, any>;
  field: Field;
}

interface FieldProps {
  field: Field;
  value?: boolean;
  onChange?: (value: boolean) => void;
  autoFocus?: boolean;
}

interface FilterLabelProps {
  label: string;
  type: keyof FilterTypes;
  value: string;
}

interface GraphQLProps {
  path: string;
  type: keyof FilterTypes;
  value: string;
}

interface FilterType {
  label: string;
  initialValue: string;
}

interface FilterTypes {
  is: FilterType;
  not: FilterType;
}

/**
 * Filter component for checkbox fields
 */
export function Filter({ value, onChange }: FilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="checkbox-filter"
        checked={value === "true"}
        onCheckedChange={(checked) => onChange(String(checked))}
      />
      <label htmlFor="checkbox-filter" className="text-sm">
        Checked
      </label>
    </div>
  );
}

/**
 * Get available filter types for checkbox fields
 */
export function getFilterTypes(): FilterTypes {
  return {
    is: {
      label: "Is checked",
      initialValue: "true",
    },
    not: {
      label: "Is not checked",
      initialValue: "true",
    },
  };
}

/**
 * Cell component for rendering checkbox values in a list view
 */
export function Cell({ item, field }: CellProps) {
  const value = !!item[field.path];
  return (
    <div className="flex items-center">
      <Checkbox disabled checked={value} />
      <span className="ml-2">{value ? "True" : "False"}</span>
    </div>
  );
}

export function CardValue({ item, field }: CellProps) {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path] + ""}
    </FieldContainer>
  );
}

export function Field({ field, value, onChange, autoFocus }: FieldProps) {
  return (
    <FieldContainer>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.path}
          autoFocus={autoFocus}
          disabled={onChange === undefined}
          onCheckedChange={(checked) => {
            onChange?.(checked === true);
          }}
          checked={value}
          aria-describedby={
            field.description === null ? undefined : `${field.path}-description`
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor={field.path} className="text-sm font-medium">
            {field.label}
          </label>
          {field.description && (
            <FieldDescription id={`${field.path}-description`}>
              {field.description}
            </FieldDescription>
          )}
        </div>
      </div>
    </FieldContainer>
  );
}

// Filter controller for checkbox fields
export const filter = {
  Filter,
  types: getFilterTypes(),
  Label: ({ label, type, value }: FilterLabelProps) => {
    const filterType = getFilterTypes()[type];
    return filterType ? `${label} ${filterType.label.toLowerCase()}` : "";
  },
  graphql: ({ path, type, value }: GraphQLProps) => {
    const isChecked = value === "true";

    switch (type) {
      case "is":
        return { [path]: { equals: isChecked } };
      case "not":
        return { [path]: { not: { equals: isChecked } } };
      default:
        return {};
    }
  },
};

export const controller = (config: Field) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: config.fieldMeta.defaultValue ?? false,
    deserialize(item: Record<string, any>) {
      const value = item[config.path];
      return typeof value === "boolean" ? value : false;
    },
    serialize(value: boolean) {
      return {
        [config.path]: value,
      };
    },
    filter: {
      Filter() {
        return null;
      },
      graphql({ type }: { type: string }) {
        return { [config.path]: { equals: type === "is" } };
      },
      Label({ label }: { label: string }) {
        return label.toLowerCase();
      },
      types: {
        is: {
          label: "is",
          initialValue: true,
        },
        not: {
          label: "is not",
          initialValue: true,
        },
      },
    },
  };
};
