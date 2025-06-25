import React from 'react';
import { getFieldTypeFromViewsIndex, getField } from "@/features/dashboard/views/registry";
import type { BaseField } from '@/features/dashboard/types';
import type { Field } from '@/features/dashboard/views/registry';

interface ClientFieldWrapperProps {
  field: BaseField;
  rawValue: unknown;
  kind: 'create' | 'update';
}

const ClientFieldWrapper: React.FC<ClientFieldWrapperProps> = ({
  field,
  rawValue,
  // kind, // Removed unused prop
}) => {
  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
  const fieldImpl = getField(fieldType);
  const FieldComponent = fieldImpl?.client?.Field;

  if (!FieldComponent) {
    return null;
  }

  // Convert BaseField to Field
  const registryField: Field = {
    path: field.path,
    label: field.label,
    description: field.description,
    fieldMeta: {
      isRequired: field.fieldMeta?.isRequired,
      min: field.fieldMeta?.min,
      max: field.fieldMeta?.max,
      isNullable: field.fieldMeta?.isNullable,
    },
    viewsIndex: field.viewsIndex,
  };

  return (
    <FieldComponent
      field={registryField}
      value={rawValue}
      forceValidation={false}
    />
  );
};

export default ClientFieldWrapper; 