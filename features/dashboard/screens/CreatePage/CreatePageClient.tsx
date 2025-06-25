"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import { useCreateItem } from "@/features/dashboard/hooks/useCreateItem";
import { GraphQLErrorNotice } from "@/features/dashboard/components/GraphQLErrorNotice";
import { useListByPath } from "@/features/dashboard/hooks/useAdminMeta";
import { Fields } from "@/features/dashboard/components/Fields";

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export function CreatePageClient({ listKey }: { listKey: string }) {
  const router = useRouter();
  const { list, isLoading } = useListByPath(listKey);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  // Hooks must be called unconditionally before early returns
  const createItemState = useCreateItem(list!); // Assert list is defined

  const handleCreate = useCallback(async () => {
    if (!list) return; // Guard against list being undefined
    
    setSaveState("saving");
    try {
      const item = await createItemState.create();
      if (item) {
        setSaveState("saved");
        router.push(`/dashboard/${list.path}/${item.id}`);
      }
    } catch (err) {
      setSaveState("idle");
      console.error("Failed to create item:", err);
    }
  }, [createItemState, list, router]); // Add list to dependency array

  // Show loading state while fetching list
  if (isLoading || !list) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="w-full max-w-5xl p-4 md:p-6 pb-16 lg:pb-6">
      <div className="grid lg:grid-cols-[minmax(240px,2fr)_3fr] gap-6 gap-y-8 min-h-[calc(100vh-8rem)]">
        {/* Left column */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7.5rem)] flex flex-col h-full">
          <div className="space-y-6 flex-grow overflow-y-auto pb-2">
            <div>
              <h1 className="text-lg font-semibold md:text-2xl">
                Create {list.singular}
              </h1>
              <p className="text-muted-foreground">
                {list.description || `Create a new ${list.singular.toLowerCase()}`}
              </p>
            </div>
          </div>

          {/* Action buttons - visible only on larger screens */}
          <div className="hidden lg:flex flex-col mr-auto">
            {/* Status indicators above buttons */}
            <div className="flex justify-center mb-2">
              {saveState === "saving" && (
                <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  <span>Creating...</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/${list.path}`)}
                disabled={saveState === "saving"}
              >
                <X className="size-4 shrink-0" />
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleCreate}
                disabled={createItemState.invalidFields.size > 0 || saveState === "saving"}
              >
                Create {list.singular}
                <Check className="ml-1 stroke-[1.5px]" width="10" height="10" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Floating action bar - visible only on smaller screens */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 lg:hidden flex flex-col items-center gap-1.5">
          {/* Status indicators above the button container */}
          <div className="flex justify-center">
            {saveState === "saving" && (
              <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                <Loader2 className="animate-spin h-3.5 w-3.5" />
                <span>Creating...</span>
              </div>
            )}
          </div>

          {/* Button container */}
          <div className="bg-background border rounded-md px-3 py-2 shadow-md w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/${list.path}`)}
                disabled={saveState === "saving"}
              >
                <X className="size-4 shrink-0" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>

              <Button
                size="sm"
                onClick={handleCreate}
                disabled={createItemState.invalidFields.size > 0 || saveState === "saving"}
              >
                <span className="hidden sm:inline">Create {list.singular}</span>
                <span className="sm:hidden">Create</span>
                <Check className="ml-1 stroke-[1.5px]" width="10" height="10" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right column / Main content */}
        <div className="space-y-6">
          {createItemState.error && (
            <GraphQLErrorNotice
              networkError={createItemState.error.networkError}
              errors={createItemState.error.graphQLErrors}
            />
          )}

          {/* Form Fields */}
          <Fields
            fields={list.fields}
            value={createItemState.props.value}
            onChange={createItemState.props.onChange as any}
            forceValidation={createItemState.props.forceValidation}
            invalidFields={new Set(Array.from(createItemState.invalidFields).map(String))}
          />
        </div>
      </div>
    </main>
  );
} 