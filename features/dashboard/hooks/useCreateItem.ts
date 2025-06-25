import { useState, useMemo, useCallback } from 'react';
import type { GraphQLError } from 'graphql';
import type { List, Field } from '@/features/dashboard/types';
import { createItem } from '@/features/dashboard/actions';
import type { KeystoneResponse } from '@/features/dashboard/lib/keystoneClient';
import isDeepEqual from 'fast-deep-equal';

interface CreateItemState {
  state: 'loading' | 'error' | 'success' | 'editing';
  error?: {
    networkError?: Error;
    graphQLErrors?: readonly GraphQLError[];
  };
}

interface FieldValue {
  kind: 'value';
  value: any;
}

interface FormValue {
  [key: string]: FieldValue;
}

export function useCreateItem(list: List) {
  const [formState, setFormState] = useState<CreateItemState>({ state: 'editing' });

  // Get field modes from createView
  const fieldModes = useMemo(() => {
    const modes: Record<string, 'edit' | 'hidden'> = {};
    Object.entries(list.fields).forEach(([path, field]: [string, Field]) => {
      modes[path] = field.createView?.fieldMode || 'edit';
    });
    return modes;
  }, [list.fields]);

  // Only include fields that aren't hidden in createView
  const visibleFields = useMemo(() => {
    return Object.fromEntries(
      Object.entries(list.fields).filter(
        ([path]) => fieldModes[path] !== 'hidden'
      )
    );
  }, [list.fields, fieldModes]);

  const [value, setValue] = useState<FormValue>(() => {
    const value: FormValue = {};
    Object.keys(visibleFields).forEach((fieldPath) => {
      value[fieldPath] = {
        kind: "value",
        value: list.fields[fieldPath].controller.defaultValue,
      };
    });
    return value;
  });

  const invalidFields = useMemo(() => {
    const invalidFields = new Set<string>();

    Object.keys(value).forEach((fieldPath) => {
      const val = value[fieldPath].value;

      if (visibleFields[fieldPath]?.controller?.validate) {
        const validateFn = visibleFields[fieldPath].controller.validate;
        if (validateFn && validateFn(val) === false) {
          invalidFields.add(fieldPath);
        }
      }
    });
    return invalidFields;
  }, [visibleFields, value]);

  const [forceValidation, setForceValidation] = useState(false);

  // Memoize the data object to prevent unnecessary re-renders
  const data = useMemo(() => {
    const dataObj: Record<string, any> = {};
    Object.keys(visibleFields).forEach((fieldPath) => {
      const { controller } = visibleFields[fieldPath];
      const serialized = controller.serialize(value[fieldPath]?.value);
      if (
        !isDeepEqual(serialized, controller.serialize(controller.defaultValue))
      ) {
        Object.assign(dataObj, serialized);
      }
    });
    return dataObj;
  }, [visibleFields, value]);

  const create = useCallback(async () => {
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);

    if (newForceValidation) return undefined;

    setFormState({ state: 'loading' });

    try {
      const selectedFields = `id ${list.labelField}`;
      const response: KeystoneResponse<any> = await createItem(
        list.key,
        data,
        {
          createMutationName: list.gqlNames?.createMutationName || '',
          createInputName: list.gqlNames?.createInputName || ''
        },
        selectedFields
      );

      if (response.success && response.data?.item) {
        setFormState({ state: 'success' });
        return response.data.item;
      } else {
        const errorMessage = response.error || 'Failed to create item or missing item data.';
        const error = new Error(errorMessage);
        setFormState({
          state: 'error',
          error: {
            networkError: error,
          }
        });
        return undefined;
      }
    } catch (err) {
      const error = err as Error & { graphQLErrors?: readonly GraphQLError[] };
      setFormState({
        state: 'error',
        error: {
          networkError: error,
          graphQLErrors: error.graphQLErrors
        }
      });
      return undefined;
    }
  }, [list, invalidFields, data]);

  return {
    props: {
      fields: visibleFields,
      groups: list.groups,
      fieldModes,
      value,
      onChange: useCallback((getNewValue: (prev: FormValue) => FormValue) => {
        setValue((oldValues) => getNewValue(oldValues));
      }, []),
      forceValidation,
    },
    create,
    state: formState.state,
    error: formState.error,
    invalidFields,
    shouldPreventNavigation: Object.keys(data).length !== 0
  };
}