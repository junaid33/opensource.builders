"use client"

import { Fragment, useState } from "react";
// @ts-ignore
import dumbPasswords from "dumb-passwords";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface PasswordValue {
  kind: 'initial' | 'editing';
  value: string;
  confirm: string;
  isSet: boolean | null;
}

interface ValidationConfig {
  isRequired?: boolean;
  length?: {
    min: number;
    max: number | null;
  };
  match?: {
    regex: RegExp;
    explanation: string;
  } | null;
  rejectCommon?: boolean;
}

interface Field {
  path: string;
  label: string;
  description?: string;
  validation?: ValidationConfig;
}

interface FieldProps {
  field: Field;
  value: PasswordValue;
  onChange?: (value: PasswordValue) => void;
  forceValidation?: boolean;
  autoFocus?: boolean;
}

interface CellProps {
  item: Record<string, any>;
  field: Field;
}

interface FilterProps {
  value: string | number;
  onChange: (value: string | number) => void;
}

interface Config {
  path: string;
  label: string;
  description?: string;
  fieldMeta?: {
    validation?: ValidationConfig;
    isNullable?: boolean;
  };
}

function validate(value: PasswordValue, validation?: ValidationConfig, fieldLabel?: string): string | undefined {
  if (
    value.kind === "initial" &&
    (value.isSet === null || value.isSet === true)
  ) {
    return undefined;
  }
  if (value.kind === "initial" && validation?.isRequired) {
    return `${fieldLabel} is required`;
  }
  if (value.kind === "editing" && value.confirm !== value.value) {
    return `The passwords do not match`;
  }
  if (value.kind === "editing") {
    const val = value.value;
    if (validation?.length?.min && val.length < validation.length.min) {
      if (validation.length.min === 1) {
        return `${fieldLabel} must not be empty`;
      }
      return `${fieldLabel} must be at least ${validation.length.min} characters long`;
    }
    if (validation?.length?.max !== null && validation?.length?.max && val.length > validation.length.max) {
      return `${fieldLabel} must be no longer than ${validation.length.max} characters`;
    }
    if (validation?.match && !validation.match.regex.test(val)) {
      return validation.match.explanation;
    }
    if (validation?.rejectCommon && dumbPasswords.check(val)) {
      return `${fieldLabel} is too common and is not allowed`;
    }
  }
  return undefined;
}

function isSetText(isSet: boolean | null): string {
  return isSet == null ? "Access Denied" : isSet ? "Is set" : "Is not set";
}

export const Field = ({
  field,
  value,
  onChange,
  forceValidation,
  autoFocus,
}: FieldProps) => {
  const [showInputValue, setShowInputValue] = useState(false);
  const [touchedFirstInput, setTouchedFirstInput] = useState(false);
  const [touchedSecondInput, setTouchedSecondInput] = useState(false);
  const shouldShowValidation =
    forceValidation || (touchedFirstInput && touchedSecondInput);
  const validationMessage = shouldShowValidation
    ? validate(value, field.validation, field.label)
    : undefined;
  const validation = validationMessage && (
    <span className="text-red-600 dark:text-red-700 text-sm">
      {validationMessage}
    </span>
  );
  const inputType = showInputValue ? "text" : "password";
  
  return (
    <FieldContainer as="fieldset">
      <FieldLabel as="legend">{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>
        {field.description}
      </FieldDescription>
      {onChange === undefined ? (
        isSetText(value.isSet)
      ) : value.kind === "initial" ? (
        <Fragment>
          <Button
            autoFocus={autoFocus}
            onClick={() => {
              onChange({
                kind: "editing",
                confirm: "",
                value: "",
                isSet: value.isSet,
              });
            }}
            className="text-xs shadow-sm border border-zinc-200 dark:border-zinc-800 uppercase tracking-wide py-2.5 px-4 bg-muted/40 dark:bg-zinc-800/40"
            variant="secondary"
          >
            {value.isSet ? "Change Password" : "Set Password"}
          </Button>
          {validation}
        </Fragment>
      ) : (
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <div style={{ flexGrow: 1, flexBasis: "200px" }}>
              <TextInput
                id={`${field.path}-new-password`}
                autoFocus
                invalid={validationMessage !== undefined}
                type={inputType}
                value={value.value}
                placeholder="New Password"
                onChange={(event) => {
                  onChange({
                    ...value,
                    value: event.target.value,
                  });
                }}
                onBlur={() => {
                  setTouchedFirstInput(true);
                }}
              />
            </div>
            <div style={{ flexGrow: 1, flexBasis: "200px" }}>
              <label
                htmlFor={`${field.path}-confirm-password`}
                className="sr-only"
              >
                Confirm Password
              </label>
              <TextInput
                id={`${field.path}-confirm-password`}
                invalid={validationMessage !== undefined}
                type={inputType}
                value={value.confirm}
                placeholder="Confirm Password"
                onChange={(event) => {
                  onChange({
                    ...value,
                    confirm: event.target.value,
                  });
                }}
                onBlur={() => {
                  setTouchedSecondInput(true);
                }}
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                setShowInputValue(!showInputValue);
              }}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <span className="sr-only">
                {showInputValue ? "Hide Text" : "Show Text"}
              </span>
              {showInputValue ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onChange({
                  kind: "initial",
                  value: "",
                  confirm: "",
                  isSet: value.isSet,
                });
              }}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <span className="sr-only">Cancel</span>
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
          {validation}
        </div>
      )}
    </FieldContainer>
  );
};

export const Cell = ({ item, field }: CellProps) => {
  return <div>{isSetText(item[field.path]?.isSet)}</div>;
};

export const CardValue = ({ item, field }: { item: Record<string, any>; field: Field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {isSetText(item[field.path]?.isSet)}
    </FieldContainer>
  );
};

export const controller = (config: Config) => {
  const validation: ValidationConfig = {
    ...config.fieldMeta?.validation,
    match:
      config.fieldMeta?.validation?.match === null
        ? null
        : config.fieldMeta?.validation?.match ? {
            regex: new RegExp(
              config.fieldMeta.validation.match.regex.source,
              config.fieldMeta.validation.match.regex.flags
            ),
            explanation: config.fieldMeta.validation.match.explanation,
          } : undefined,
  };
  
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} {isSet}`,
    validation,
    defaultValue: {
      kind: "initial" as const,
      value: "",
      confirm: "",
      isSet: false,
    },
    validate: (state: PasswordValue) =>
      validate(state, validation, config.label) === undefined,
    deserialize: (data: Record<string, any>) => ({
      kind: "initial" as const,
      value: "",
      confirm: "",
      isSet: data[config.path]?.isSet ?? null,
    }),
    serialize: (value: PasswordValue) => {
      if (value.kind === "initial") return {};
      return { [config.path]: value.value };
    },
    filter:
      config.fieldMeta?.isNullable === false
        ? undefined
        : {
            Filter(props: FilterProps) {
              return (
                <ToggleGroup
                  type="single"
                  value={props.value.toString()}
                  onValueChange={(value) => {
                    props.onChange(Number(value));
                  }}
                >
                  <ToggleGroupItem value="0">Is Not Set</ToggleGroupItem>
                  <ToggleGroupItem value="1">Is Set</ToggleGroupItem>
                </ToggleGroup>
              );
            },
            graphql: ({ value }: { value: number }) => {
              return { [config.path]: { isSet: value === 1 } };
            },
            Label({ value }: { value: number }) {
              return value ? "is set" : "is not set";
            },
            types: {
              is_set: {
                label: "Is Set",
                initialValue: true,
              },
            },
          },
  };
};