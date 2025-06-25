"use client";

import { useState } from "react";
import { Pagination } from "./Pagination";
import { deleteManyItems } from "@/features/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaginationWrapperProps {
  currentPage: number;
  total: number;
  pageSize: number;
  list: {
    singular: string;
    plural: string;
    path?: string;
    gqlNames: {
      deleteMutationName: string;
      listQueryName: string;
      itemQueryName: string;
      listQueryCountName: string;
      listOrderName: string;
      updateMutationName: string;
      createMutationName: string;
      whereInputName: string;
      whereUniqueInputName: string;
      updateInputName: string;
      createInputName: string;
    };
  };
  onItemsDeleted?: () => void;
}

export function PaginationWrapper({
  currentPage,
  total,
  pageSize,
  list,
  onItemsDeleted,
}: PaginationWrapperProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetSelection = () => {
    setSelectedItems(new Set());
    setError(null);
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedItems);
    if (idsToDelete.length === 0) return;

    setIsDeleteLoading(true);
    setError(null);
    try {
      const response = await deleteManyItems(list.path || list.singular, idsToDelete, list.gqlNames);

      if (response.success) {
        setSelectedItems(new Set());
        toast.success(`Successfully deleted ${idsToDelete.length} ${idsToDelete.length === 1 ? list.singular : list.plural}`);
        onItemsDeleted?.();
      } else {
        console.error("Error deleting items:", response.error);
        setError(response.error);
        toast.error("Failed to delete items", {
          description: response.error,
        });
      }
    } catch (err) {
      // Catch any unexpected errors during the API call itself (e.g., network issues)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during deletion';
      console.error("Unexpected error during delete:", err);
      setError(errorMessage);
      toast.error("An unexpected error occurred", {
        description: errorMessage,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Badge variant="destructive" className="hover:bg-destructive/10 bg-destructive/5 flex text-base items-start gap-2 border border-destructive/50 p-4 rounded-sm mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="uppercase tracking-wider font-semibold text-sm">Error</h2>
            <span className="break-all text-sm opacity-75 font-normal">{error}</span>
          </div>
        </Badge>
      )}
      <Pagination
        currentPage={currentPage}
        total={total}
        pageSize={pageSize}
        list={list}
        selectedItems={selectedItems}
        onResetSelection={handleResetSelection}
        onDelete={handleDelete}
        isDeleteLoading={isDeleteLoading}
      />
    </>
  );
} 