"use client";

import { useId, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldMeta as AdminFieldMeta } from '@/features/dashboard/types'; // Import FieldMeta as AdminFieldMeta

// Field description component
const FieldDescription = ({ 
  children, 
  id, 
  className 
}: { 
  children: React.ReactNode; 
  id: string; 
  className?: string 
}) => {
  return (
    <p id={id} className={className}>
      {children}
    </p>
  );
};

// Remove local FieldMeta definition, use AdminFieldMeta from types/admin-meta instead

export interface FieldGroupMeta {
  label: string;
  description?: string | null;
  fields: { path: string }[];
  collapsed?: boolean;
}

interface FieldValue {
  kind: 'error' | 'value';
  errors?: Array<{ message: string }>;
  value?: unknown;
}

export function Fields({
  fields,
  value,
  fieldModes = null,
  fieldPositions = null,
  forceValidation,
  invalidFields,
  position = "form",
  groups = [],
  onChange,
}: {
  fields: Record<string, AdminFieldMeta>; // Use imported AdminFieldMeta
  value: Record<string, FieldValue>;
  fieldModes?: Record<string, "edit" | "read" | "hidden"> | null;
  fieldPositions?: Record<string, "form" | "sidebar"> | null;
  forceValidation: boolean;
  invalidFields?: ReadonlySet<string>;
  position?: "form" | "sidebar";
  groups?: FieldGroupMeta[];
  onChange?: (value: Record<string, FieldValue>) => void;
}) {
  const renderedFields = Object.fromEntries(
    Object.keys(fields).map((fieldKey) => {
      const field = fields[fieldKey];
      const val = value?.[fieldKey];
      const fieldMode = fieldModes === null ? "edit" : fieldModes[fieldKey];
      const fieldPosition =
        fieldPositions === null ? "form" : fieldPositions[fieldKey];

      // Skip if field should be hidden or not in this position
      if (fieldMode === "hidden") return [fieldKey, null];
      if (fieldPosition !== position) return [fieldKey, null];

      // Handle error state
      if (val?.kind === "error" && val.errors?.[0]) {
        return [
          fieldKey,
          <div key={fieldKey}>
            {field.label}:{" "}
            <span className="text-red-600 dark:text-red-700 text-sm">
              {val.errors[0].message}
            </span>
          </div>,
        ];
      }

      // Skip if no value is available
      if (!val) return [fieldKey, null];

      const FieldComponent = field.views?.Field;
      if (!FieldComponent) return [fieldKey, null]; // Skip if Field component doesn't exist

      const controller = field.controller;
      if (!controller) return [fieldKey, null]; // Skip if no controller

      return [
        fieldKey,
        <FieldComponent
          key={fieldKey}
          field={{
            ...controller,
            // Safely access hideButtons, checking if fieldMeta is an object and has the property
            hideButtons: typeof field.fieldMeta === 'object' && field.fieldMeta !== null && 'hideButtons' in field.fieldMeta ? field.fieldMeta.hideButtons : undefined,
          }}
          onChange={fieldMode === "edit" && onChange !== undefined ?
            (newFieldValue: unknown) => {
              // Explicitly type prevVal and ensure the callback structure matches expectations
              onChange((prevVal: Record<string, FieldValue>) => ({
                ...prevVal,
                [controller.path]: { kind: "value", value: newFieldValue },
              }));
            } : undefined
          }
          value={val.value}
          forceValidation={forceValidation && invalidFields?.has(fieldKey)}
          // Remove invalidFields prop as it's not expected by FieldComponent (FieldProps)
        />
      ];
    })
  );

  const rendered: ReactNode[] = [];
  const fieldGroups = new Map();
  for (const group of groups) {
    const state = { group, rendered: false };
    for (const field of group.fields) {
      fieldGroups.set(field.path, state);
    }
  }

  for (const field of Object.values(fields)) {
    const fieldKey = field.path;
    if (fieldGroups.has(fieldKey)) {
      const groupState = fieldGroups.get(field.path);
      if (groupState.rendered) {
        continue;
      }
      groupState.rendered = true;
      const { group } = groupState;
      const renderedFieldsInGroup = group.fields.map(
        (field: { path: string }) => renderedFields[field.path]
      );
      if (renderedFieldsInGroup.every((field: ReactNode | null) => field === null)) {
        continue;
      }

      rendered.push(
        <FieldGroup
          key={group.label}
          count={group.fields.length}
          label={group.label}
          description={group.description}
          collapsed={group.collapsed}
        >
          {renderedFieldsInGroup}
        </FieldGroup>
      );
      continue;
    }
    if (renderedFields[fieldKey] === null) {
      continue;
    }
    rendered.push(renderedFields[fieldKey]);
  }

  return (
    <div className="grid w-full items-center gap-4">
      {rendered.length === 0 && value && Object.keys(value).length === 0
        ? "There are no fields that you can read or edit"
        : rendered}
    </div>
  );
}

function FieldGroup(props: {
  label: string;
  description?: string | null;
  count: number;
  collapsed?: boolean;
  children: ReactNode;
}) {
  const descriptionId = useId();
  const labelId = useId();

  const divider = <Separator orientation="vertical" />;

  // Count actual fields (excluding virtual fields in create view)
  const actualFieldCount = props.children ? Array.isArray(props.children) ? props.children.filter(
    (item) =>
      item !== undefined &&
      !(
        item?.props?.value &&
        typeof item?.props?.value === "symbol" &&
        item?.props?.value.toString() ===
          "Symbol(create view virtual field value)"
      )
  ).length : 1 : 0;

  // Don't render the group if there are no actual fields
  if (actualFieldCount === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={props.description === null || props.description === undefined ? undefined : descriptionId}
    >
      <details open={!props.collapsed} className="group">
        <summary className="list-none outline-none [&::-webkit-details-marker]:hidden cursor-pointer">
          <div className="flex gap-1.5">
            <span>
              <div
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "border self-start transition-transform group-open:rotate-90 [&_svg]:size-3 h-6 w-6"
                )}
              >
                <ChevronRight />
              </div>
            </span>
            {divider}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div id={labelId} className="relative text-lg/5 font-medium">
                  {props.label}
                </div>
                <Badge className="text-[.7rem] py-0.5 uppercase tracking-wide font-medium">
                  {actualFieldCount} FIELD{actualFieldCount !== 1 && "S"}
                </Badge>
              </div>
              {props.description !== null && props.description !== undefined && (
                <FieldDescription
                  className="opacity-50 text-sm"
                  id={descriptionId}
                >
                  {props.description}
                </FieldDescription>
              )}
            </div>
          </div>
        </summary>
        <div className="flex ml-[2.25rem] mt-2">
          {divider}
          <div className="w-full">
            <div className="space-y-4">{props.children}</div>
          </div>
        </div>
      </details>
    </div>
  );
}
