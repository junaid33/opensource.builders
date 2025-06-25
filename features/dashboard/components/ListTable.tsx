"use client"

import Link from "next/link";
import { getFieldTypeFromViewsIndex, getField } from '@/features/dashboard/views/registry';
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { deleteManyItems } from "@/features/dashboard/actions";
import type { ListMeta as List } from "@/features/dashboard/types";
import { Pagination } from "@/features/dashboard/components/Pagination";
import type { ReactNode } from 'react';
import type { FieldController } from '@/features/dashboard/types';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Define types for the list and field structures
interface Field {
  path: string;
  label: string;
  viewsIndex: number;
  isOrderable?: boolean;
  description?: string | null;
  controller?: FieldController<unknown>;
}

interface ListItem {
  id: string;
  [key: string]: unknown;
}

interface ListData {
  items: ListItem[];
  meta: {
    count: number;
    [key: string]: unknown;
  };
}

interface CellComponent {
  supportsLinkTo?: boolean;
  (props: {
    item: ListItem;
    field: import('@/features/dashboard/types').FieldMeta;
    linkTo?: { href: string };
  }): ReactNode;
}

interface FieldImplementation {
  graphql?: {
    getGraphQLSelection?: (fieldKey: string) => string;
  };
  server?: {
    transformFilter?: (path: string, operator: string, value: unknown) => Record<string, unknown>;
  };
  client?: {
    Cell?: CellComponent;
  };
}

// Helper function to get GraphQL selections for a field
export function getFieldSelections(field: import('@/features/dashboard/types').FieldMeta, fieldKey: string): string {
  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
  const fieldImpl = getField(fieldType) as FieldImplementation | undefined;

  if (fieldImpl?.graphql?.getGraphQLSelection) {
    return fieldImpl.graphql.getGraphQLSelection(fieldKey);
  }

  return fieldKey;
}

// Helper function to transform filter params to GraphQL
export function transformFilter(field: import('@/features/dashboard/types').FieldMeta, operator: string, value: unknown): Record<string, unknown> {
  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
  const fieldImpl = getField(fieldType) as FieldImplementation | undefined;

  if (fieldImpl?.server?.transformFilter) {
    return fieldImpl.server.transformFilter(field.path, operator, value);
  }

  return { [field.path]: { [operator]: value } };
}

interface ListTableProps {
  data: ListData;
  list: List;
  selectedFields: string[];
  currentPage: number;
  pageSize: number;
}

export function ListTable({
  data,
  list,
  selectedFields,
  currentPage,
  pageSize,
}: ListTableProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams() || new URLSearchParams();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for selected items
  const [selectedItemsState, setSelectedItems] = useState<{
    itemsFromServer?: ListItem[];
    selectedItems: Set<string>;
  }>(() => ({
    itemsFromServer: undefined,
    selectedItems: new Set(),
  }));

  // Update selected items when data changes
  useEffect(() => {
    if (data.items && selectedItemsState.itemsFromServer !== data.items) {
      const newSelectedItems = new Set<string>();
      data.items.forEach(item => {
        if (selectedItemsState.selectedItems.has(item.id)) {
          newSelectedItems.add(item.id);
        }
      });
      setSelectedItems({
        itemsFromServer: data.items,
        selectedItems: newSelectedItems,
      });
    }
  }, [data.items, selectedItemsState.itemsFromServer, selectedItemsState.selectedItems]);

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedItemsState.selectedItems);
    if (idsToDelete.length === 0) return;

    setIsDeleteLoading(true);
    setError(null);
    try {
      if (!list.gqlNames?.deleteManyMutationName) {
        throw new Error('Delete mutation name not found');
      }
      const response = await deleteManyItems(list.key, idsToDelete, {
        deleteManyMutationName: list.gqlNames.deleteManyMutationName,
        whereUniqueInputName: list.gqlNames.whereUniqueInputName,
      });

      if (response.success) {
        setSelectedItems({
          itemsFromServer: selectedItemsState.itemsFromServer,
          selectedItems: new Set(),
        });
        toast.success(`Successfully deleted ${idsToDelete.length} ${idsToDelete.length === 1 ? list.singular : list.plural}`);
        router.refresh();
      } else {
        console.error("Error deleting items:", response.error);
        setError(response.error); // Assuming setError updates some state to display the error
        toast.error("Failed to delete items", {
          description: response.error,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleResetSelection = () => {
    setSelectedItems({
      itemsFromServer: selectedItemsState.itemsFromServer,
      selectedItems: new Set(),
    });
  };

  if (!data || !data.items) {
    return <div>No data available</div>;
  }

  // Create a query object that behaves like the old query object
  const query: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  // Function to render cell content based on field type
  const renderCellContent = (item: ListItem, fieldKey: string, list: List, isFirstField: boolean) => {
    const field = list.fields[fieldKey];
    if (!field) return null;

    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType) as FieldImplementation | undefined;

    // If the field has no value, render null state
    if (item[fieldKey] === null || item[fieldKey] === undefined) {
      return <div className="font-mono text-xs rounded-sm px-2 py-1 border-dashed border italic">null</div>;
    }

    // If the field type has a Cell component, use it
    if (fieldImpl?.client?.Cell) {
      const CellComponent = fieldImpl.client.Cell;
      const linkTo = isFirstField && CellComponent.supportsLinkTo
        ? { href: `/${list.path}/${encodeURIComponent(item.id)}` }
        : undefined;

      return <CellComponent item={item} field={field} linkTo={linkTo} />;
    }

    // Fallback to basic string representation
    return String(item[fieldKey]);
  };

  const handleSort = (fieldKey: string) => {
    const field = list.fields[fieldKey];
    if (!field.isOrderable) return;

    const currentSort = query.sortBy;
    const newSort = currentSort === fieldKey ? `-${fieldKey}` : fieldKey;

    const newSearchParams = new URLSearchParams(query);
    newSearchParams.set('sortBy', newSort);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="relative">
      {error && (
        <Badge variant="destructive" className="hover:bg-destructive/10 bg-destructive/5 flex text-base items-start gap-2 border border-destructive/50 p-4 rounded-sm mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="uppercase tracking-wider font-semibold text-sm">Error</h2>
            <span className="break-all text-sm opacity-75 font-normal">{error}</span>
          </div>
        </Badge>
      )}

      {/* Single scrollable container with sticky header */}
      <div className="relative w-full border-y bg-background mb-18">
        <div className="relative overflow-auto" style={{ position: 'relative' }}>
          <table className="w-full border-collapse min-w-full">
            <thead className="sticky top-0 z-20 bg-background border-b">
              <tr>
                <th className="w-[64px] pl-6 bg-background text-left font-normal">
                  <Checkbox
                    checked={selectedItemsState.selectedItems.size === data.items.length}
                    onCheckedChange={(checked) => {
                      const newSelectedItems = new Set<string>();
                      if (checked) {
                        data.items.forEach(item => {
                          if (item && item.id) {
                            newSelectedItems.add(item.id);
                          }
                        });
                      }
                      setSelectedItems({
                        itemsFromServer: selectedItemsState.itemsFromServer,
                        selectedItems: newSelectedItems,
                      });
                    }}
                  />
                </th>
                {selectedFields.map((fieldKey: string) => {
                  const field = list.fields[fieldKey];
                  const sort = query.sortBy;
                  const sortField = sort?.startsWith('-') ? sort.slice(1) : sort;
                  const sortDirection = sort?.startsWith('-') ? 'DESC' : 'ASC';

                  return (
                    <th
                      key={fieldKey}
                      className={cn(
                        "whitespace-nowrap px-5 bg-background text-left",
                        fieldKey === sortField
                          ? "text-gray-900 dark:text-gray-50"
                          : "text-gray-700 dark:text-gray-300",
                        "text-sm font-medium"
                      )}
                    >
                      <button
                        onClick={() => handleSort(fieldKey)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-md py-3",
                          field.isOrderable
                            ? "hover:text-gray-900 dark:hover:text-gray-50"
                            : "cursor-default"
                        )}
                      >
                        <span>{field.label}</span>
                        {field.isOrderable && (
                          <div className="-space-y-2">
                            <ChevronUp
                              className={cn(
                                "size-3.5",
                                fieldKey === sortField && sortDirection === "ASC"
                                  ? "text-blue-500"
                                  : "opacity-30"
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "size-3.5",
                                fieldKey === sortField && sortDirection === "DESC"
                                  ? "text-blue-500"
                                  : "opacity-30"
                              )}
                            />
                          </div>
                        )}
                      </button>
                    </th>
                  );
                })}
                <th className="whitespace-nowrap py-3 px-5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-background text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((item: ListItem) => (
                <tr
                  key={item.id}
                  className={cn(
                    "group select-none hover:bg-muted",
                    selectedItemsState.selectedItems.has(item.id) && "bg-muted"
                  )}
                >
                  <td className="relative w-[64px] pl-6 py-3">
                    {selectedItemsState.selectedItems.has(item.id) && (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-500 dark:bg-blue-500" />
                    )}
                    <Checkbox
                      checked={selectedItemsState.selectedItems.has(item.id)}
                      onCheckedChange={(checked) => {
                        const newSelectedItems = new Set(selectedItemsState.selectedItems);
                        if (checked) {
                          newSelectedItems.add(item.id);
                        } else {
                          newSelectedItems.delete(item.id);
                        }
                        setSelectedItems({
                          itemsFromServer: selectedItemsState.itemsFromServer,
                          selectedItems: newSelectedItems,
                        });
                      }}
                    />
                  </td>
                  {selectedFields.map((fieldKey: string, index) => (
                    <td
                      key={`${item.id}-${fieldKey}`}
                      className={cn(
                        "whitespace-nowrap py-3 px-5",
                        "text-gray-600 dark:text-gray-400 text-sm"
                      )}
                    >
                      {renderCellContent(item, fieldKey, list, index === 0)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap py-3 px-5 text-sm text-gray-600 dark:text-gray-400">
                    <Link
                      href={`/dashboard/${list.path}/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          total={data.meta.count || 0}
          pageSize={pageSize}
          list={{
            singular: list.singular,
            plural: list.plural
          }}
          selectedItems={selectedItemsState.selectedItems}
          onResetSelection={handleResetSelection}
          onDelete={handleDelete}
          isDeleteLoading={isDeleteLoading}
        />
      )}
    </div>
  );
}

