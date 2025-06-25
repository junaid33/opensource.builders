import { useMemo, useState } from "react";
import isDeepEqual from "fast-deep-equal";
import { Button } from "@/components/ui/button";
import { createItem } from "@/features/dashboard/actions";
import { serializeValueToObjByFieldKey } from "@/features/dashboard/lib/serialization";
import { useInvalidFields } from "@/features/dashboard/lib/useInvalidFields";
import { Fields } from "@/features/dashboard/components/Fields";

function useFieldsObj(list: any, fields: string[]) {
  return useMemo(() => {
    const editFields: { [key: string]: any } = {};
    fields?.forEach((fieldPath) => {
      editFields[fieldPath] = list.fields[fieldPath];
    });
    return editFields;
  }, [fields, list.fields]);
}

interface InlineCreateProps {
  list: any;
  onCancel: () => void;
  onCreate: (itemGetter: any) => void;
  fields: string[];
  selectedFields: string;
}

export function InlineCreate({
  list,
  onCancel,
  onCreate,
  fields: fieldPaths,
  selectedFields,
}: InlineCreateProps) {
  const fields = useFieldsObj(list, fieldPaths);

  const [value, setValue] = useState<{ [key: string]: any }>(() => {
    const value: { [key: string]: any } = {};
    Object.keys(fields).forEach((fieldPath) => {
      value[fieldPath] = {
        kind: "value",
        value: fields[fieldPath].controller.defaultValue,
      };
    });
    return value;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const invalidFields = useInvalidFields(fields, value);
  const [forceValidation, setForceValidation] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);

    if (newForceValidation) return;
    const data = {};
    const allSerializedValues = serializeValueToObjByFieldKey(fields, value);
    Object.keys(allSerializedValues).forEach((fieldPath) => {
      const { controller } = fields[fieldPath];
      const serialized = allSerializedValues[fieldPath];
      if (
        !isDeepEqual(serialized, controller.serialize(controller.defaultValue))
      ) {
        Object.assign(data, serialized);
      }
    });

    setLoading(true);
    try {
      const response = await createItem(
        list.key,
        data,
        {
          createMutationName: list.gqlNames.createMutationName,
          createInputName: list.gqlNames.createInputName,
        },
        selectedFields
      );

      if (response.success && response.data?.item?.id) {
        onCreate(response.data.item.id);
      } else {
        // Throw an error or set the error state based on the response
        const errorMessage = response.error || 'Failed to create item or item ID not found in response.';
        setError(new Error(errorMessage));
      }
    } catch (err: any) {
      // Catch unexpected errors during the action call itself
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3">
        {error && <>{JSON.stringify(error)}</>}
        <Fields
          fields={fields}
          forceValidation={forceValidation}
          invalidFields={invalidFields}
          onChange={setValue}
          value={value}
        />
        <div className="flex gap-1 flex-wrap">
          <Button disabled={loading} size="sm" type="submit">
            Create {list.singular}
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
