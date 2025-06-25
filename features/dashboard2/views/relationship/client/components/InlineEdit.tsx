import { useCallback, useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import { updateItemInline } from '@/features/dashboard/actions';
import { makeDataGetter } from "@/features/dashboard/lib/dataGetter";
import { deserializeValue } from "@/features/dashboard/lib/serialization";
import { useChangedFieldsAndDataForUpdate } from "@/features/dashboard/lib/useChangedFieldsAndDataForUpdate";
import { useInvalidFields } from "@/features/dashboard/lib/useInvalidFields";
import { Fields } from "@/features/dashboard/components/Fields";
// Define FieldValue type locally since it's not exported
type FieldValue = { kind: 'error', errors: Array<{ message: string }> } | { kind: 'value', value: any };
import { GraphQLError } from 'graphql'; // Import GraphQLError if needed for typing errors
// import { GraphQLErrorNotice } from "@/components/ui/graphql-error-notice";
// import { useToasts } from "@/components/ui/toast";
import type { FieldMeta, ListMeta } from '@/features/dashboard/types'; // Import necessary types


function useFieldsObj(list: ListMeta, fields: string[]) { // Use ListMeta type for list
  return useMemo(() => {
    // Explicitly type editFields as Record<string, FieldMeta>
    const editFields: Record<string, FieldMeta> = {};
    fields?.forEach((fieldPath) => {
      // Check if the field exists on the list before assigning
      if (list.fields && list.fields[fieldPath]) {
        editFields[fieldPath] = list.fields[fieldPath];
      }
    });
    return editFields;
  }, [fields, list.fields]);
}

interface InlineEditProps {
  fields: string[];
  list: ListMeta; // Use ListMeta type for list
  selectedFields: string;
  itemGetter: any; // Consider typing this more strictly if possible
  onCancel: () => void;
  onSave: (itemGetter: any) => void;
}

export function InlineEdit({
  fields: fieldPaths,
  list,
  selectedFields,
  itemGetter,
  onCancel,
  onSave,
}: InlineEditProps) {
  const fieldsObj = useFieldsObj(list, fieldPaths);
//   const toasts = useToasts();

  const [state, setValue] = useState(() => {
    const value = deserializeValue(fieldsObj, itemGetter);
    return { value, item: itemGetter.data };
  });

  if (
    state.item !== itemGetter.data &&
    itemGetter.errors?.every((x: any) => x.path?.length !== 1)
  ) {
    const value = deserializeValue(fieldsObj, itemGetter);
    setValue({ value, item: itemGetter.data });
  }

  const { changedFields, dataForUpdate } = useChangedFieldsAndDataForUpdate(
    fieldsObj,
    itemGetter,
    state.value
  );

  const invalidFields = useInvalidFields(fieldsObj, state.value);
  const [forceValidation, setForceValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (changedFields.size === 0) {
      onCancel();
      return;
    }
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);
    if (newForceValidation) return;

    setLoading(true);
    try {
      // Ensure gqlNames exists before calling
      if (!list.gqlNames) {
        throw new Error(`gqlNames not found for list ${list.key}`);
      }
      // Call the server action and store the response
      const response = await updateItemInline(
        list.key,
        itemGetter.get("id").data,
        dataForUpdate,
        selectedFields,
        { // Add the missing gqlNames argument
          updateInputName: list.gqlNames.updateInputName,
          updateMutationName: list.gqlNames.updateMutationName,
        }
      );

      // Handle the KeystoneResponse object
      if (response.success) {
        // Ensure data and item exist before proceeding
        if (response.data?.item) {
          // Create a new DataGetter with the successful response data
          const newItemGetter = makeDataGetter(response.data, undefined).get("item");
          console.log("Saved successfully:", newItemGetter.data);
          onSave(newItemGetter);
        } else {
          // Handle unexpected case where success is true but data/item is missing
          const unexpectedError = new Error("Update successful but no item data returned.");
          setError(unexpectedError);
          console.error("Unexpected response:", response);
        }
      } else {
        // Handle the error case
        const errorMessage = response.error || "An unknown error occurred during update.";
        const error = new Error(errorMessage);
        setError(error);
        console.error("Update failed:", errorMessage);
      }
    } catch (err) {
      setError(err);
    //   toasts.error({
    //     title: "Failed to update item",
    //     description: err.message,
    //   });
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform state.value to match the expected FieldValue structure for Fields component
  const valueForFields = useMemo(() => {
    const transformedValue: Record<string, FieldValue> = {}; // Use FieldValue type
    for (const key in state.value) {
      const currentVal = state.value[key];
      if (currentVal.kind === 'error' && currentVal.errors) {
        // Map readonly GraphQLError array to mutable { message: string } array
        transformedValue[key] = {
          kind: 'error',
          // Ensure err has a message property before accessing it
          errors: currentVal.errors.map((err: { message?: string }) => ({ message: err.message || 'Unknown error' })),
        };
      } else if (currentVal.kind === 'value') {
         // Pass 'value' kind through directly
        transformedValue[key] = {
            kind: 'value',
            value: currentVal.value
        };
      }
      // Handle cases where currentVal might not match expected structure if necessary
    }
    return transformedValue;
  }, [state.value]);

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3">
        {error && (
        //   <GraphQLErrorNotice
        //     networkError={error?.networkError}
        //     errors={error?.graphQLErrors?.filter((x: any) => x.path?.length === 1)}
        //   />
        <>
        {error && <div className="text-red-600 text-sm">{JSON.stringify(error)}</div>}
        </>
        )}
        {/* {JSON.stringify({fieldsObj})} */}
        <Fields
          fields={fieldsObj}
          forceValidation={forceValidation}
          invalidFields={invalidFields}
          onChange={(value: Record<string, FieldValue>) => {
              setValue((prevState) => {
                return {
                  item: prevState.item,
                  value: value,
                };
              });
            }}
          value={valueForFields} // Pass the transformed value
        />
        <div className="flex gap-1 flex-wrap justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={loading} size="sm" type="submit">
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
} 