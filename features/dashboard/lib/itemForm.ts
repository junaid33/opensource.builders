import type { FieldMeta } from '@/features/dashboard/types';

// Type definitions
interface FieldValue {
  kind: 'error' | 'value';
  errors?: Array<{ message: string }>;
  value?: unknown;
}

interface ItemGetter {
  data?: any;
  errors?: Array<{ message: string; path?: string[] }>;
  get: (path: string) => ItemGetter;
}

// Deserialize value from item data based on field controllers
export function deserializeValue(
  fields: Record<string, FieldMeta>,
  itemGetter: ItemGetter
): Record<string, FieldValue> {
  const value: Record<string, FieldValue> = {};
  
  Object.keys(fields).forEach((fieldKey) => {
    const field = fields[fieldKey];
    const fieldGetter = itemGetter.get(fieldKey);
    
    if (fieldGetter.errors) {
      value[fieldKey] = {
        kind: 'error',
        errors: fieldGetter.errors,
      };
    } else {
      try {
        const deserializedValue = field.controller.deserialize ? 
          field.controller.deserialize(fieldGetter) : 
          fieldGetter.data;
          
        value[fieldKey] = {
          kind: 'value',
          value: deserializedValue,
        };
      } catch (error) {
        value[fieldKey] = {
          kind: 'error',
          errors: [{ message: error instanceof Error ? error.message : 'Deserialization error' }],
        };
      }
    }
  });
  
  return value;
}

// Validate fields and return invalid field keys
export function useInvalidFields(
  fields: Record<string, FieldMeta>,
  value: Record<string, FieldValue>
): ReadonlySet<string> {
  const invalidFields = new Set<string>();
  
  Object.keys(fields).forEach((fieldKey) => {
    const field = fields[fieldKey];
    const fieldValue = value[fieldKey];
    
    if (!fieldValue || fieldValue.kind === 'error') {
      invalidFields.add(fieldKey);
      return;
    }
    
    // Run field validation if available
    if (field.controller.validate) {
      const validationResult = field.controller.validate(fieldValue.value);
      if (validationResult === false) {
        invalidFields.add(fieldKey);
      } else if (typeof validationResult === 'string') {
        invalidFields.add(fieldKey);
      }
    }
  });
  
  return invalidFields;
}

// Get changed fields and prepare data for update
export function useChangedFieldsAndDataForUpdate(
  fields: Record<string, FieldMeta>,
  item: ItemGetter,
  value: Record<string, FieldValue>
): { changedFields: Set<string>; dataForUpdate: Record<string, any> } {
  const changedFields = new Set<string>();
  const dataForUpdate: Record<string, any> = {};
  
  Object.keys(fields).forEach((fieldKey) => {
    const field = fields[fieldKey];
    const fieldValue = value[fieldKey];
    
    if (!fieldValue || fieldValue.kind === 'error') {
      return;
    }
    
    const hasChanged = field.controller.hasChanged ? 
      field.controller.hasChanged(item.get(fieldKey), fieldValue.value) :
      item.get(fieldKey).data !== fieldValue.value;
    
    if (hasChanged) {
      changedFields.add(fieldKey);
      
      // Serialize the value for GraphQL mutation
      const serializedValue = field.controller.serialize ? 
        field.controller.serialize(fieldValue.value) : 
        fieldValue.value;
        
      dataForUpdate[fieldKey] = serializedValue;
    }
  });
  
  return { changedFields, dataForUpdate };
}