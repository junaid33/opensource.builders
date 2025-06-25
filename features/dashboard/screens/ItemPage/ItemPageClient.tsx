"use client";

import { useCallback, useState, useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangleIcon,
  Check,
  CircleAlert,
  Copy,
  Loader2,
  Undo2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

import type { FieldMeta } from '@/features/dashboard/types';
import { useListByPath } from '@/features/dashboard/hooks/useAdminMeta';
import { deleteItem } from '@/features/dashboard/actions';
import { toast } from 'sonner';
import { Fields } from '@/features/dashboard/components/Fields';
import { makeDataGetter } from '@/features/dashboard/lib/dataGetter';
import { useItemForm } from '@/features/dashboard/lib/useItemForm';
import type { ItemData } from '@/features/dashboard/lib/serialization';
import type { Value } from '@/features/dashboard/lib/useChangedFieldsAndDataForUpdate';
import { basePath } from '../../lib/config';

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ItemPageClientProps {
  item: Record<string, unknown>;
  id: string;
  fieldModes: Record<string, 'read' | 'edit' | 'hidden'>;
  fieldPositions: Record<string, 'form' | 'sidebar'>;
  uiConfig?: {
    hideDelete?: boolean;
  };
  listKey: string;
}

export function ItemPageClient({
  item,
  id,
  fieldModes,
  fieldPositions,
  uiConfig,
  listKey,
}: ItemPageClientProps) {
  const router = useRouter();
  const { list, isLoading } = useListByPath(listKey);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Pre-compute values that don't depend on list to avoid React Hook conditionals
  const itemWithId = item as ItemData;
  const dataGetter = makeDataGetter(itemWithId, undefined);

  // Get selected fields - defined outside conditional block
  const selectedFields = useMemo(() => {
    if (!list) return '';
    return Object.keys(list.fields)
      .map((key) => list.fields[key].controller?.graphqlSelection)
      .filter(Boolean)
      .join('\n');
  }, [list]);

  // Initialize form state - defined outside conditional block with proper type definition
  const itemForm = useItemForm({
    list:
      list ||
      ({ fields: {}, key: listKey } as {
        fields: Record<string, FieldMeta>;
        key: string;
      }), // Using a minimal type definition
    fields: list?.fields || {},
    selectedFields,
    itemGetter: dataGetter,
  });

  // Define callback outside conditional block with proper deps
  const handleValueChange = useCallback(
    (valueUpdater: (prevValue: Value) => Value) => {
      itemForm.setValue((state) => ({
        item: state.item,
        value: valueUpdater(state.value),
      }));
    },
    [itemForm] // Include itemForm in deps
  );

  // Split fields based on position - defined outside conditional block
  const fieldsSplit = useMemo(() => {
    const sidebarFields: Record<string, FieldMeta> = {};
    const mainFields: Record<string, FieldMeta> = {};

    if (list) {
      Object.entries(list.fields).forEach(([key, field]) => {
        if (fieldPositions[key] === 'sidebar') {
          sidebarFields[key] = field;
        } else {
          mainFields[key] = field;
        }
      });
    }

    return { sidebarFields, mainFields };
  }, [list, fieldPositions]);

  // Early return for loading or missing list
  if (isLoading || !list) {
    return <LoadingSkeleton />;
  }

  const itemLabel = (item[list.labelField] as string) || id;

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await itemForm.onSave();
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch {
      // Don't need the error variable if we're not using it
      setSaveState('idle');
      toast.error('Failed to save changes');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteItem(list.key, id, {
        deleteMutationName: list.gqlNames?.deleteMutationName || '',
      });

      if (response.success) {
        toast.success(`Deleted ${list?.singular || 'item'} successfully`);
        router.push(`${basePath}/${list?.path || ''}`);
      } else {
        toast.error(`Failed to delete: ${response.error || 'Unknown error'}`);
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete item');
      setIsDeleting(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    toast.success('ID copied to clipboard');
  };

  return (
    <main className="w-full max-w-5xl p-4 md:p-6 pb-16 lg:pb-6">
      <div className="grid lg:grid-cols-[minmax(240px,2fr)_3fr] gap-6 gap-y-8 min-h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7.5rem)] flex flex-col h-full">
          <div className="space-y-6 flex-grow overflow-y-auto pb-2">
            <div>
              <h1
                className="text-lg font-semibold md:text-2xl"
                title={itemLabel}
              >
                {itemLabel}
              </h1>
              <div className="mt-6">

                <div className="relative border rounded-md bg-muted/40 transition-all">
                  <div className="p-1 flex items-center gap-3">
                    <div className="flex gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="bg-background shadow-xs border rounded-sm py-0.5 px-1 text-[.65rem] text-muted-foreground">
                          ID
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono truncate">
                          {id}
                        </div>
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
              </div>
            </div>

            {/* Sidebar Fields */}
            {Object.keys(fieldsSplit.sidebarFields).length > 0 && (
              <Fields
                fields={fieldsSplit.sidebarFields}
                fieldModes={fieldModes}
                fieldPositions={fieldPositions}
                value={itemForm.state.value}
                onChange={handleValueChange}
                forceValidation={itemForm.forceValidation}
                invalidFields={itemForm.invalidFields}
              />
            )}
          </div>

          {/* Action buttons - visible only on larger screens */}
          <div className="hidden lg:flex flex-col mr-auto">
            {/* Status indicators above buttons */}
            <div className="flex justify-center mb-2">
              {saveState === 'saving' && (
                <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  <span>Saving...</span>
                </div>
              )}
              {saveState === 'saved' && (
                <div className="flex items-center gap-x-1.5 text-xs text-emerald-500">
                  <Check className="h-3.5 w-3.5" />
                  <span>Saved</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {!uiConfig?.hideDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const deleteTrigger =
                      document.querySelector<HTMLButtonElement>(
                        '[data-delete-trigger]'
                      );
                    deleteTrigger?.click();
                  }}
                  disabled={itemForm.loading || saveState === 'saving'}
                >
                  <X className="size-4 shrink-0" />
                  Delete
                </Button>
              )}
              {itemForm.changedFields.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={itemForm.onReset}
                  disabled={itemForm.loading || saveState === 'saving'}
                >
                  <Undo2 className="size-4 shrink-0" />
                  Reset
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  !(itemForm.changedFields.size > 0) ||
                  itemForm.loading ||
                  saveState === 'saving'
                }
              >
                Save Changes
                <Check className="ml-1 stroke-[1.5px]" width="10" height="10" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Floating action bar - visible only on smaller screens */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 lg:hidden flex flex-col items-center gap-1.5">
          {/* Status indicators above the button container */}
          <div className="flex justify-center">
            {saveState === 'saving' && (
              <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                <Loader2 className="animate-spin h-3.5 w-3.5" />
                <span>Saving...</span>
              </div>
            )}
            {saveState === 'saved' && (
              <div className="flex items-center gap-x-1.5 text-xs text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                <span>Saved</span>
              </div>
            )}
          </div>

          {/* Button container */}
          <div className="bg-background border rounded-md px-3 py-2 shadow-md w-full">
            <div className="flex flex-wrap items-center gap-2">
              {!uiConfig?.hideDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const deleteTrigger =
                      document.querySelector<HTMLButtonElement>(
                        '[data-delete-trigger]'
                      );
                    deleteTrigger?.click();
                  }}
                  disabled={itemForm.loading || saveState === 'saving'}
                >
                  <X className="size-4 shrink-0" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
              {itemForm.changedFields.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={itemForm.onReset}
                  disabled={itemForm.loading || saveState === 'saving'}
                >
                  <Undo2 className="size-4 shrink-0" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  !(itemForm.changedFields.size > 0) ||
                  itemForm.loading ||
                  saveState === 'saving'
                }
              >
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
                <Check className="ml-1 stroke-[1.5px]" width="10" height="10" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {itemForm.error && (
            <Badge color="rose" className="items-start gap-4 border p-4">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h2 className="font-medium">Error</h2>
                <p>{itemForm.error.message}</p>
              </div>
            </Badge>
          )}

          {/* Main Fields */}
          {Object.keys(fieldsSplit.mainFields).length > 0 && (
            <Fields
              fields={fieldsSplit.mainFields}
              fieldModes={fieldModes}
              fieldPositions={fieldPositions}
              value={itemForm.state.value}
              onChange={handleValueChange}
              forceValidation={itemForm.forceValidation}
              invalidFields={itemForm.invalidFields}
            />
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {!uiConfig?.hideDelete && (
        <Dialog>
          <DialogTrigger asChild>
            <button className="hidden" data-delete-trigger>
              Delete
            </button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex gap-4">
              <div>
                <Badge color="rose" className="rounded-full p-2 border">
                  <AlertTriangleIcon className="h-4 w-4" />
                </Badge>
              </div>
              <DialogHeader>
                <DialogTitle>Delete {itemLabel}?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                className="rounded-lg"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}