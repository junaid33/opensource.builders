'use client';

import React, { useCallback, useMemo } from 'react';
import { AlertCircle, Copy, Loader2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Fields } from '@/features/dashboard/components/Fields';
import { useItemForm } from '@/features/dashboard/lib/useItemForm';
import { makeDataGetter } from '@/features/dashboard/lib/dataGetter';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { GraphQLErrorNotice } from '@/features/dashboard/components/GraphQLErrorNotice';
import { useList } from '@/features/dashboard/hooks/useAdminMeta';
import type { ItemData } from '@/features/dashboard/lib/serialization';
import type { FieldMeta } from '@/features/dashboard/types';
import type { Value } from '@/features/dashboard/lib/useChangedFieldsAndDataForUpdate';
import { Skeleton } from '@/components/ui/skeleton';
import { getItemAction } from '../actions';

interface EditItemDrawerProps {
  listKey: string;
  itemId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  // Optional: limit which fields are shown
  fields?: string[];
}

interface EditItemDrawerClientProps {
  list: any; // Using any temporarily until we fix TypeScript issues
  item: Record<string, unknown>;
  itemId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  fields?: string[];
}

// Loading skeleton for the drawer
function LoadingSkeleton() {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          <Skeleton className="h-7 w-40" />
        </DrawerTitle>
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="px-2 py-1 bg-muted rounded text-xs h-6 w-60" />
          <div className="h-5 w-5 flex items-center justify-center">
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </div>
      </DrawerHeader>

      <DrawerBody className="pt-6 space-y-8">
        {/* Form fields */}
        <div className="space-y-8">
          {/* Text fields */}
          {[1, 2, 3].map((field) => (
            <div key={field} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
              {field === 2 && <Skeleton className="h-3 w-3/4 mt-1" />}
            </div>
          ))}

          {/* Select field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Checkbox group */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-2">
              {[1, 2].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Date field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Textarea field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-3 w-2/3 mt-1" />
          </div>
        </div>
      </DrawerBody>

      <DrawerFooter className="flex justify-between gap-2 pt-4 border-t">
        <Skeleton className="h-10 w-24 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </DrawerFooter>
    </>
  );
}

// Client component that handles the form UI and logic
export function EditItemDrawerClient({
  list,
  item,
  itemId,
  open,
  onClose,
  onSaved,
  fields,
}: EditItemDrawerClientProps) {
  // Create a DataGetter for the item
  const itemWithId = item as unknown as ItemData;
  const dataGetter = makeDataGetter(itemWithId, undefined);

  // Get field modes and positions from list configuration
  const fieldModes: Record<string, 'edit' | 'read' | 'hidden'> = {};
  const fieldPositions: Record<string, 'form' | 'sidebar'> = {};

  // Filter fields if specified
  const fieldsToUse = fields
    ? Object.fromEntries(
        Object.entries(list.fields).filter(([path]) => fields.includes(path))
      )
    : list.fields;

  Object.entries(fieldsToUse).forEach(([path, field]) => {
    fieldModes[path] = (field.itemView?.fieldMode || 'edit') as
      | 'edit'
      | 'read'
      | 'hidden';
    fieldPositions[path] = (field.itemView?.fieldPosition || 'form') as
      | 'form'
      | 'sidebar';
  });

  // Get selected fields for the form
  const selectedFields = useMemo(() => {
    return Object.keys(list.fields)
      .map((key) => {
        return list.fields[key]?.controller?.graphqlSelection;
      })
      .filter(Boolean)
      .join('\n');
  }, [list.fields]);

  // Use the form handling hook
  const {
    state,
    setValue,
    loading: formLoading,
    error: formError,
    forceValidation,
    invalidFields,
    changedFields,
    onSave,
    onReset,
  } = useItemForm({
    list,
    fields: fieldsToUse,
    selectedFields,
    itemGetter: dataGetter,
  });

  const handleValueChange = useCallback(
    (valueUpdater: (prevValue: Value) => Value) => {
      setValue((state) => ({
        item: state.item,
        value: valueUpdater(state.value),
      }));
    },
    [setValue]
  );

  // Handle save with loading state
  const handleSave = async () => {
    try {
      await onSave();
      onSaved?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to save changes', {
        description: errorMessage,
      });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(itemId);
    toast.success('ID copied to clipboard');
  };

  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="p-4">
        <Badge
          variant="outline"
          className="items-start gap-4 border p-4 text-destructive"
        >
          <AlertCircle className="h-5 w-5" />
          <div className="flex flex-col">
            <h2 className="uppercase tracking-wide font-medium">
              Item Not Found
            </h2>
            <span>
              The item could not be found or you do not have access to it.
            </span>
          </div>
        </Badge>
      </div>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-lg">Edit {list.singular}</DrawerTitle>

        <div className="relative border rounded-md bg-muted/40 transition-all">
          <div className="p-1 flex items-center gap-3">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="bg-background shadow-xs border rounded-sm py-0.5 px-1 text-[.65rem] text-muted-foreground">
                  ID
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono truncate">{itemId}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm h-6 w-6 flex-shrink-0"
              onClick={handleCopyId}
            >
              <Copy className="size-3" />
              <span className="sr-only">Copy ID</span>
            </Button>
          </div>
        </div>
      </DrawerHeader>

      <DrawerBody className="pt-6">
        {formError && (
          <GraphQLErrorNotice
            networkError={formError?.networkError}
            errors={formError?.graphQLErrors}
          />
        )}

        <Fields
          fields={fieldsToUse}
          fieldModes={fieldModes}
          fieldPositions={fieldPositions}
          forceValidation={forceValidation}
          invalidFields={invalidFields}
          value={state.value}
          onChange={handleValueChange}
          position="form"
          groups={list.groups || []}
        />
      </DrawerBody>

      <DrawerFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        {changedFields.size > 0 && (
          <Button variant="outline" onClick={onReset} disabled={formLoading}>
            Reset
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!changedFields.size || formLoading}
        >
          Save Changes
        </Button>
      </DrawerFooter>
    </>
  );
}

// Outer component that handles list loading
export function EditItemDrawer({
  listKey,
  itemId,
  open,
  onClose,
  onSaved,
  fields,
}: EditItemDrawerProps) {
  const { list, isLoading: isListLoading } = useList(listKey);
  const [item, setItem] = React.useState<Record<string, unknown> | null>(null);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchItem() {
      if (!list || !open) return;

      try {
        setIsDataLoading(true);
        const response = await getItemAction(list, itemId);

        if (response.success && response.data?.item) {
          setItem(response.data.item as Record<string, unknown>);
        } else {
          console.error(
            'Error fetching item:',
            response.error || 'Unknown error'
          );
          toast.error('Failed to load item');
          setItem(null);
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        toast.error('Failed to load item');
        setItem(null);
      } finally {
        setIsDataLoading(false);
      }
    }

    if (open) {
      fetchItem();
    }
  }, [list, itemId, open]);

  const isLoading = isListLoading || isDataLoading;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <EditItemDrawerClient
            list={list}
            item={item || { id: itemId }}
            itemId={itemId}
            open={open}
            onClose={onClose}
            onSaved={onSaved}
            fields={fields}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default EditItemDrawer;
