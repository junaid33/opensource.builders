"use client"

import { Input } from "@/components/ui/input";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { Field as ImageField, ImageWrapper, Placeholder, validateImage } from './Field';

interface CellProps {
  item: Record<string, any>;
  field: { path: string; label: string };
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
}

// Export the Field component from Field.tsx
export { ImageField as Field };

export function Cell({ item, field }: CellProps) {
  const data = item[field.path];
  if (!data) return null;
  return (
    <div className="flex items-center h-6 w-6 leading-none">
      <img
        alt={data.filename}
        className="max-h-full max-w-full"
        src={data.url}
      />
    </div>
  );
}

export function CardValue({ item, field }: CellProps) {
  const data = item[field.path];
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {data && (
        <ImageWrapper>
          <img className="w-full" alt={data.filename} src={data.url} />
        </ImageWrapper>
      )}
    </FieldContainer>
  );
}

export function Filter({ value, onChange }: FilterProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. jpg, png"
      className="w-full"
    />
  );
}

interface Config {
  path: string;
  label: string;
  description?: string;
}

export const controller = (config: Config) => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} {
      url
      id
      extension
      width
      height
      filesize
    }`,
    defaultValue: { kind: "empty" },
    deserialize(item: Record<string, any>) {
      const value = item[config.path];
      if (!value) return { kind: "empty" };
      return {
        kind: "from-server",
        data: {
          src: value.url,
          id: value.id,
          extension: value.extension,
          ref: value.ref,
          width: value.width,
          height: value.height,
          filesize: value.filesize,
        },
      };
    },
    validate(value: any) {
      return value.kind !== "upload" || validateImage(value.data) === undefined;
    },
    serialize(value: any) {

      if (value?.kind === "upload") {
        return { [config.path]: { upload: value.data.file } };
      }
      if (value?.kind === "remove") {
        return { [config.path]: null };
      }
      return {};
    },
  };
}; 