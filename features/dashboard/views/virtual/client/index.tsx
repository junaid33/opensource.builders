"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldDescription } from "@/components/ui/field-description";

interface Field {
  path: string;
  label: string;
  description?: string;
}

interface PrettyDataProps {
  data: unknown;
}

interface CellProps {
  item: Record<string, any>;
  field: Field;
}

interface FieldProps {
  field: Field;
  value?: { value: unknown; initial?: unknown; kind: "update" | "create" };
}

interface FilterTypes {}

interface FilterLabelProps {
  label: string;
  type: string;
  value: string;
}

interface GraphQLProps {
  path: string;
  type: string;
  value: string;
}

/**
 * Pretty print data for display
 */
function PrettyData({ data }: PrettyDataProps) {
  if (data === null || data === undefined) {
    return <span className="text-muted-foreground">null</span>;
  }

  if (typeof data === "object") {
    return <pre className="text-sm max-w-full overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
  }

  return <span className="break-words">{String(data)}</span>;
}

/**
 * Virtual fields don't support filtering
 */
export function Filter(): null {
  return null;
}

/**
 * Virtual fields don't have filter types
 */
export function getFilterTypes(): FilterTypes {
  return {};
}

/**
 * Cell component for rendering virtual field values in a list view
 */
export function Cell({ item, field }: CellProps) {
  const value = item[field.path];

  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">No value</span>;
  }

  if (typeof value === "object") {
    return (
      <pre className="text-xs max-w-[300px] truncate">
        {JSON.stringify(value)}
      </pre>
    );
  }

  return <span>{String(value)}</span>;
}

export function Field({ field, value }: FieldProps) {
  // Hide the field if the value is the default createViewValue
  if (value?.kind === "create" && value.value === null) {
    return null;
  }

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      {field.description && (
        <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>
      )}
      <div className="min-h-11 flex items-start gap-4 justify-between border py-2 px-4 rounded-md bg-muted/20">
        <div className="break-all">
          <PrettyData data={value} />
        </div>
        <Badge
          variant="secondary"
          className="border border-border rounded-sm text-xs opacity-75 -mr-1 mt-0.5"
        >
          READ ONLY
        </Badge>
      </div>
    </FieldContainer>
  );
}

// Virtual fields don't support filtering
export const filter = {
  Filter,
  types: getFilterTypes(),
  Label: ({ label, type, value }: FilterLabelProps): ReactNode => null,
  graphql: ({ path, type, value }: GraphQLProps): Record<string, any> => ({}),
};

// Create view value constant
const createViewValue = {
  kind: "create",
  value: null,
};

export const controller = (config: {
  path: string;
  label: string;
  description?: string;
  fieldMeta: {
    query?: string;
  };
}) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path}${config.fieldMeta.query || ''}`,
    defaultValue: createViewValue,
    deserialize: (data: Record<string, any>) => {
      return data[config.path];
    },
    serialize: () => ({}),
  };
};
