'use client';

import { useState, useCallback, useRef, useEffect } from 'react'
import type { FieldMeta, ListMeta } from '@/features/dashboard/types'
import type { DataGetter } from './dataGetter'
import { deserializeValue } from './serialization'
import { useChangedFieldsAndDataForUpdate, type Value } from './useChangedFieldsAndDataForUpdate'
import { useInvalidFields } from './useInvalidFields'
import type { ItemData } from './serialization'
import type { GraphQLError } from 'graphql'
import { updateItem } from '@/features/dashboard/actions'
import { toast } from 'sonner'

// Types for item form handling
export interface FieldError {
  message: string;
  path?: string[];
}

export interface ValueState {
  item: DataGetter<ItemData>;
  value: Value;
}

export interface ItemFormState {
  state: ValueState;
  setValue: React.Dispatch<React.SetStateAction<ValueState>>;
  loading: boolean;
  error: Error | null;
  forceValidation: boolean;
  invalidFields: Set<string>;
  changedFields: Set<string>;
  onSave: () => Promise<void>;
  onReset: () => void;
  dataForUpdate: Record<string, unknown>;
}

// Helper type for React event callback functions
type AnyFunction = (...args: unknown[]) => unknown;

function useEventCallback<Func extends AnyFunction>(callback: Func): Func {
  const callbackRef = useRef(callback)
  const cb = useCallback((...args: Parameters<Func>) => {
    return callbackRef.current(...args)
  }, []) as Func
  
  useEffect(() => {
    callbackRef.current = callback
  })
  
  return cb
}

function useItemState(
  fields: Record<string, FieldMeta>,
  itemGetter: DataGetter<ItemData>
): [ValueState, React.Dispatch<React.SetStateAction<ValueState>>] {
  const [state, setValue] = useState<ValueState>(() => ({
    value: deserializeValue(fields, itemGetter),
    item: itemGetter,
  }));

  if (
    itemGetter &&
    state.item.data !== itemGetter.data &&
    (itemGetter.errors || []).every((x: GraphQLError) => x.path?.length !== 1)
  ) {
    const value = deserializeValue(fields, itemGetter);
    setValue({ value, item: itemGetter });
  }

  return [state, setValue];
}

export function useItemForm({
  list,
  fields,
  itemGetter,
}: {
  list: ListMeta
  fields: Record<string, FieldMeta>
  selectedFields?: string // Mark as optional since it's not used
  itemGetter: DataGetter<ItemData>
}): ItemFormState {
  const [state, setValue] = useItemState(fields, itemGetter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { changedFields, dataForUpdate } = useChangedFieldsAndDataForUpdate(
    fields,
    state.item,
    state.value
  )

  const invalidFieldsReadonly = useInvalidFields(fields, state.value)
  // Convert ReadonlySet to mutable Set
  const invalidFields = new Set<string>(Array.from(invalidFieldsReadonly))
  const [forceValidation, setForceValidation] = useState(false)

  const onSave = useEventCallback(async () => {
    const newForceValidation = invalidFields.size !== 0
    setForceValidation(newForceValidation)
    if (newForceValidation) return

    setLoading(true)
    setError(null)

    const itemId = state.item.get('id').data;
    if (!itemId) {
      setError(new Error('No item ID found'));
      toast.error('Failed to update item', {
        description: 'No item ID found',
      });
      setLoading(false); // Ensure loading is stopped
      return;
    }

    try {
      const response = await updateItem(
        list.key,
        itemId as string,
        dataForUpdate,
        {
          updateMutationName: list.gqlNames?.updateMutationName || '',
          updateInputName: list.gqlNames?.updateInputName || '',
        }
      );

      if (response.success) {
        toast.success('Saved successfully');
        // Potentially reset form state or trigger refetch here if needed
      } else {
        console.error('Failed to update item:', response.error);
        setError(new Error(response.error || 'Unknown error')); // Set error state with the message
        toast.error('Failed to update item', {
          description: response.error || 'An unexpected error occurred.',
        });
      }
    } catch (err: unknown) {
      // Catch unexpected errors during the action call itself
      console.error('Unexpected error during updateItem call:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error('An unexpected error occurred', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setLoading(false)
    }
  })

  const onReset = useEventCallback(() => {
    setValue({
      item: state.item,
      value: deserializeValue(fields, state.item),
    })
    setForceValidation(false)
  })

  return {
    state,
    setValue,
    loading,
    error,
    forceValidation,
    invalidFields,
    changedFields,
    onSave,
    onReset,
    dataForUpdate,
  }
}