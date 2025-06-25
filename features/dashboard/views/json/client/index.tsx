"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldDescription } from "@/components/ui/field-description";
import { CellLink } from '@/features/dashboard/components/CellLink';

interface Field {
  path: string;
  label: string;
  description?: string;
  fieldMeta?: {
    isRequired?: boolean;
  };
}

interface FieldProps {
  field: Field;
  value?: any;
  onChange?: (value: any) => void;
  forceValidation?: boolean;
  autoFocus?: boolean;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  operator: string;
}

interface CellProps {
  item: Record<string, any>;
  field: Field;
  linkTo?: { href: string };
}

interface FilterTypes {
  contains: { label: string; initialValue: string };
  not_contains: { label: string; initialValue: string };
  is_empty: { label: string; initialValue: string };
}

export function Filter({ value, onChange, operator }: FilterProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter JSON value..."
      className="h-20"
    />
  );
}

export function Cell({ item, field, linkTo }: CellProps) {
  const value = item[field.path];
  if (!value) return <span className="text-muted-foreground">Empty</span>;

  let content;
  try {
    const formatted = JSON.stringify(value, null, 2);
    content = <pre className="text-xs">{formatted}</pre>;
  } catch {
    content = <span className="text-muted-foreground">Invalid JSON</span>;
  }

  return linkTo ? <CellLink href={linkTo.href}>{content}</CellLink> : content;
}

Cell.supportsLinkTo = true;

export function getFilterTypes(): FilterTypes {
  return {
    contains: {
      label: "Contains",
      initialValue: "",
    },
    not_contains: {
      label: "Does not contain",
      initialValue: "",
    },
    is_empty: {
      label: "Is empty",
      initialValue: "true",
    },
  };
}

export const controller = (config: Config) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: { kind: "value" as const, value: null },
    deserialize(item: Record<string, any>): JSONValue {
      const value = item[config.path];
      if (!value) return { kind: "value", value: null };
      try {
        return { kind: "value", value: JSON.parse(value) };
      } catch (err) {
        return { kind: "error", errors: [(err as Error).message] };
      }
    },
    validate(value: JSONValue): boolean {
      if (!value) return true;
      if (value.kind === "error") return false;
      return true;
    },
    serialize(value: JSONValue) {
      if (!value || value.kind === "error") return {};
      return { [config.path]: JSON.stringify(value.value) };
    },
  };
};

export function Field({
  field,
  forceValidation,
  value,
  onChange,
  autoFocus,
}: FieldProps) {
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      {field.description && (
        <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>
      )}
      <div>
        <Textarea
          id={field.path}
          className="bg-muted/40 mb-2"
          aria-describedby={
            field.description === null ? undefined : `${field.path}-description`
          }
          readOnly={onChange === undefined}
          autoFocus={autoFocus}
          onChange={(event) => onChange?.(event.target.value)}
          value={value?.value ? JSON.stringify(value.value, null, 2) : ""}
        />
        {forceValidation && (
          <span className="text-red-600 dark:text-red-700 text-sm">
            {"Invalid JSON"}
          </span>
        )}
      </div>
    </FieldContainer>
  );
}
