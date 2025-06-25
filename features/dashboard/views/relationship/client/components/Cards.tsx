"use client";

import React, { useEffect, useRef, useState, useMemo, forwardRef } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { InlineEdit } from "./InlineEdit";
import { InlineCreate } from "./InlineCreate";
import { RelationshipSelect } from "./RelationshipSelect";
import { getRootGraphQLFieldsFromFieldController } from "@/features/dashboard/lib/getRootGraphQLFieldsFromFieldController";
import type { ListMeta } from "@/features/dashboard/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { getRelationshipOptions } from "@/features/dashboard/actions";

// --- Types ---
interface ItemGetter {
  data: Record<string, any>;
  get: (field: string) => { data: any; errors?: any[] };
}

interface RelationshipItem {
  id: string;
  label: string;
}

interface RelationshipSelectState {
  kind: "many";
  value: RelationshipItem[];
  onChange: (items: RelationshipItem[]) => void;
}

interface RelationshipSelectProps {
  list: {
    key: string;
  };
  labelField: string;
  searchFields?: string[];
  state: RelationshipSelectState;
}

interface CardValueProps {
  field: any;
  item: Record<string, any>;
}

// Removed the local ForeignList interface definition

interface CardContainerProps {
  mode?: "view" | "edit" | "create";
  children: React.ReactNode;
  className?: string;
}

interface CardsProps {
  field: {
    refListKey: string;
    refLabelField: string;
    refSearchFields?: string[];
    many?: boolean;
    label?: string;
    displayOptions?: {
      cardFields: string[];
      inlineEdit?: {
        fields: string[];
      };
      inlineCreate?: {
        fields: string[];
      };
      removeMode?: "disconnect";
      linkToItem?: boolean;
    };
  };
  id: string | null;
  value: any;
  onChange?: (value: any) => void;
  foreignList: ListMeta; // Use ListMeta here
  localList: {
    singular?: string;
  } | null;
  forceValidation?: boolean;
}

interface Items {
  [key: string]: ItemGetter;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  loading?: boolean;
}

// Types
interface DisplayOptions {
  cardFields: string[];
  inlineEdit?: {
    fields: string[];
  };
  inlineCreate?: {
    fields: string[];
  };
  removeMode?: "disconnect";
  linkToItem?: boolean;
}

// Using Shadcn Skeleton for loading state
const LoadingState = () => (
  <div className="space-y-3">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-10 w-32" />
  </div>
);

const CardContainer = forwardRef<HTMLDivElement, CardContainerProps>(
  ({ mode = "view", children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`pl-4 relative before:content-[' '] before:bg-muted-foreground before:rounded-xl before:w-1 before:h-full before:absolute before:left-0 before:top-0 before:bottom-0 before:z-10 p-4 rounded-md border ${
          mode === "edit" || mode === "create" ? "bg-muted/50" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContainer.displayName = "CardContainer";

// Helper function to build selected fields for GraphQL queries
const getSelectedFields = (
  foreignList: ListMeta, // Use ListMeta here
  displayOptions: DisplayOptions | undefined,
  refLabelField: string
): string => {
  const fieldsToSelect = new Set<string>(["id", refLabelField]);
  
  if (displayOptions?.cardFields) {
    displayOptions.cardFields.forEach((f: string) => f && fieldsToSelect.add(f));
  }
  
  if (displayOptions?.inlineEdit?.fields) {
    displayOptions.inlineEdit.fields.forEach((f: string) => f && fieldsToSelect.add(f));
  }

  return Array.from(fieldsToSelect)
    .map((fieldPath) => {
      // Access fields correctly from ListMeta
      return foreignList.fields[fieldPath]?.controller?.graphqlSelection ?? fieldPath;
    })
    .filter(Boolean)
    .join("\n");
};

// CardFields component - only shows loading for fields that need foreignList
const CardFields = ({
  displayOptions,
  foreignList,
  itemGetter,
}: {
  displayOptions?: DisplayOptions;
  foreignList: ListMeta; // Use ListMeta here
  itemGetter: ItemGetter;
}) => {
  if (!foreignList?.fields) {
    return displayOptions?.cardFields?.map((fieldPath: string) => (
      <div key={fieldPath} className="space-y-1">
        <FieldLabel>{fieldPath}</FieldLabel>
        <Skeleton className="h-6 w-full" />
      </div>
    ));
  }

  return (
    <>
      {displayOptions?.cardFields?.map((fieldPath: string) => {
        const cardField = foreignList.fields?.[fieldPath];
        // CardValueComponent type might need adjustment based on ListMeta structure if different
        const CardValueComponent = cardField?.views?.CardValue as React.ComponentType<CardValueProps> | undefined;

        if (!cardField) {
          return (
            <div key={fieldPath} className="text-sm text-muted-foreground">
              {fieldPath}: Data unavailable
            </div>
          );
        }

        if (!CardValueComponent) {
          return (
            <div key={fieldPath} className="space-y-1">
              <FieldLabel>{cardField?.label ?? fieldPath}</FieldLabel>
              <div className="text-sm">
                {itemGetter?.data?.[fieldPath]?.toString() ?? (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
          );
        }

        const itemForField: Record<string, any> = {};
        const fieldSelection = fieldPath ? [fieldPath, "id"] : ["id"];

        fieldSelection.forEach((selection) => {
          const fieldData = itemGetter.get(selection);
          if (fieldData.errors) {
            console.error(
              `Error getting data for ${selection}:`,
              fieldData.errors
            );
            itemForField[selection] = (
              <span className="text-destructive">Error loading field</span>
            );
          } else {
            itemForField[selection] = fieldData.data;
          }
        });

        return (
          <CardValueComponent
            key={fieldPath}
            field={cardField.controller}
            item={itemForField}
          />
        );
      })}
    </>
  );
};

// LinkToItem component - only shows loading for the link
const LinkToItem = ({
  foreignList,
  id,
}: {
  foreignList: ListMeta; // Use ListMeta here
  id: string;
}) => {
  return (
    <Button variant="ghost" asChild>
      <a href={`/${foreignList.path}/${id}`}>View {foreignList.singular} details</a>
    </Button>
  );
};

// ValidationMessage component - only shows loading for validation text
const ValidationMessage = ({
  show,
  foreignList,
  localList,
}: {
  show: boolean | undefined;
  foreignList: ListMeta; // Use ListMeta here
  localList: { singular?: string; } | null;
}) => {
  if (!show) return null;
  return (
    <span className="text-destructive">
      You must finish creating and saving the {foreignList.singular} before continuing
    </span>
  );
};

export default function Cards({
  field,
  id: parentId,
  value,
  onChange,
  foreignList,
  localList,
  forceValidation,
}: CardsProps) {
  const [itemsBeingEdited, setItemsBeingEdited] = useState<Set<string>>(
    new Set()
  );
  const [showConnectItems, setShowConnectItems] = useState(false);
  const [hideConnectItemsLabel, setHideConnectItemsLabel] = useState("Cancel");
  const [isCreating, setIsCreating] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  const { displayOptions } = value;
  const currentIds = value.currentIds ? [...value.currentIds] : [];
  const refLabelField = field.refLabelField || "id";

  // Always call useSWR unconditionally
  const { data: itemsData, error: itemsError } = useSWR(
    // Use gqlNames directly from ListMeta
    foreignList?.gqlNames?.whereInputName &&
      foreignList?.gqlNames?.listQueryName &&
      currentIds.length > 0
      ? [`cards-relationship-items`, field.refListKey, currentIds.join(",")]
      : null,
    async () => {
      if (
        // Use gqlNames directly from ListMeta
        !foreignList?.gqlNames?.whereInputName ||
        !foreignList?.gqlNames?.listQueryName ||
        !foreignList?.gqlNames?.listQueryCountName
      ) {
        return null;
      }

      const selectedFields = getSelectedFields(
        foreignList,
        displayOptions,
        refLabelField
      );

      try {
        const whereClause = { id: { in: currentIds } };
        const result = await getRelationshipOptions(
          field.refListKey,
          whereClause,
          currentIds.length,
          0,
          refLabelField,
          selectedFields,
          {
            // Use gqlNames directly from ListMeta
            whereInputName: foreignList.gqlNames.whereInputName,
            listQueryName: foreignList.gqlNames.listQueryName,
            listQueryCountName: foreignList.gqlNames.listQueryCountName,
          }
        );

        if (result.success) {
          // Return the data part on success, provide default if data is null/undefined
          return result.data ?? { items: [], count: 0 };
        } else {
          // Handle the error from KeystoneResponse
          console.error("Error fetching card items (KeystoneResponse):", result.error);
          // Throw an error to be caught by the outer catch or SWR's error handling
          throw new Error(result.error || "Failed to fetch relationship options");
        }
      } catch (fetchError) {
        // This catches both network errors and the error thrown above
        console.error("Error fetching card items:", fetchError);
        throw fetchError; // Re-throw for SWR error handling
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Process items
  const items = useMemo(() => {
    // itemsData is now the 'data' part of the successful KeystoneResponse
    // Use nullish coalescing for safety
    return (itemsData?.items ?? []).reduce((acc: Items, item: any) => {
      if (item && item.id) {
        acc[item.id] = {
          data: item,
          get: (fieldName: string) => ({
            data: item[fieldName],
            errors: undefined,
          }),
        };
      }
      return acc;
    }, {});
  }, [itemsData]); // Dependency remains itemsData

  const currentIdsArrayWithFetchedItems = currentIds
    .map((idStr: string) => ({ itemGetter: items[idStr], id: idStr }))
    .filter((x): x is { itemGetter: ItemGetter; id: string } => !!x.itemGetter);

  // Focus Management
  useEffect(() => {
    if (itemsBeingEdited.size > 0) {
      const firstEditingCardId = Array.from(itemsBeingEdited)[0];
      const firstInputSelector = `[data-card-id="${firstEditingCardId}"] [data-inline-edit] input, [data-card-id="${firstEditingCardId}"] [data-inline-edit] textarea`;
      const firstInput = document.querySelector(firstInputSelector);
      (firstInput as HTMLElement)?.focus();
    } else if (isCreating) {
      const createInputSelector = `[data-inline-create] input, [data-inline-create] textarea`;
      const createInput = document.querySelector(createInputSelector);
      (createInput as HTMLElement)?.focus();
    }
  }, [itemsBeingEdited, isCreating]);

  if (itemsError) {
    return (
      <div className="p-4 text-destructive border border-destructive/50 rounded-md">
        Error loading items: {itemsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Display Existing Items */}
      {currentIdsArrayWithFetchedItems.length > 0 && (
        <ul className="list-none p-0 m-0 space-y-4">
          {currentIdsArrayWithFetchedItems.map(({ id, itemGetter }, index) => {
            const isEditMode = !!onChange && itemsBeingEdited.has(id);

            return (
              <CardContainer
                key={id}
                mode={isEditMode ? "edit" : "view"}
                data-card-id={id}
              >
                {isEditMode ? (
                  <div data-inline-edit>
                    <InlineEdit
                      list={foreignList!}
                      fields={displayOptions?.inlineEdit?.fields ?? []}
                      itemGetter={itemGetter}
                      selectedFields={getSelectedFields(
                        foreignList!,
                        displayOptions,
                        refLabelField
                      )}
                      onSave={async (newItemGetter: ItemGetter) => {
                        const newItemsBeingEdited = new Set(itemsBeingEdited);
                        newItemsBeingEdited.delete(id);
                        setItemsBeingEdited(newItemsBeingEdited);
                      }}
                      onCancel={() => {
                        const newItemsBeingEdited = new Set(itemsBeingEdited);
                        newItemsBeingEdited.delete(id);
                        setItemsBeingEdited(newItemsBeingEdited);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <CardFields
                      displayOptions={displayOptions}
                      foreignList={foreignList}
                      itemGetter={itemGetter}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {displayOptions?.inlineEdit && onChange && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setItemsBeingEdited(
                              new Set([...itemsBeingEdited, id])
                            );
                          }}
                        >
                          Edit
                        </Button>
                      )}

                      {displayOptions?.removeMode === "disconnect" &&
                        onChange && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const newCurrentIds = Array.from(
                                new Set(
                                  currentIds.filter((idVal) => idVal !== id)
                                )
                              );
                              onChange({
                                ...value,
                                currentIds: newCurrentIds,
                              });
                            }}
                          >
                            Remove
                          </Button>
                        )}

                      {displayOptions?.linkToItem && (
                        <LinkToItem foreignList={foreignList} id={id} />
                      )}
                    </div>
                  </div>
                )}
              </CardContainer>
            );
          })}
        </ul>
      )}

      {/* Inline Connect and Create Section */}
      {onChange !== undefined && (
        <>
          {showConnectItems ? (
            <CardContainer mode="edit">
              <RelationshipSelect
                list={{ key: foreignList?.key || "" }}
                labelField={refLabelField}
                searchFields={field.refSearchFields}
                autoFocus
                controlShouldRenderValue={true}
                isDisabled={onChange === undefined}
                placeholder={`Select a ${foreignList?.singular ?? "item"}`}
                state={{
                  kind: "many",
                  value: currentIdsArrayWithFetchedItems.map(
                    ({ itemGetter, id }) => ({
                      id,
                      label: itemGetter?.data[refLabelField] || id,
                      data: itemGetter?.data,
                    })
                  ),
                  onChange: (newItems: RelationshipItem[]) => {
                    const newCurrentIds = newItems.map((item) => item.id);
                    onChange({
                      ...value,
                      currentIds: newCurrentIds,
                    });
                    setShowConnectItems(false);
                  },
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConnectItems(false)}
                className="mt-2"
              >
                {hideConnectItemsLabel}
              </Button>
            </CardContainer>
          ) : isCreating ? (
            <CardContainer mode="create" data-inline-create>
              <InlineCreate
                list={foreignList!}
                fields={displayOptions?.inlineCreate?.fields ?? []}
                selectedFields={getSelectedFields(
                  foreignList!,
                  displayOptions,
                  refLabelField
                )}
                onCancel={() => {
                  setIsCreating(false);
                }}
                onCreate={(newId: string) => {
                  const newCurrentIds = field.many
                    ? [...currentIds, newId]
                    : [newId];
                  onChange({
                    ...value,
                    currentIds: new Set(newCurrentIds),
                  });
                  setIsCreating(false);
                }}
              />
            </CardContainer>
          ) : (
            displayOptions?.inlineCreate && (
              <CardContainer mode="create">
                <div className="flex gap-2 flex-wrap">
                  {displayOptions?.inlineCreate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCreating(true);
                      }}
                    >
                      Create {foreignList?.singular ?? "item"}
                    </Button>
                  )}
                  {displayOptions?.inlineCreate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowConnectItems(true);
                        setHideConnectItemsLabel("Cancel");
                      }}
                    >
                      Link existing {foreignList?.singular ?? "item"}
                    </Button>
                  )}
                </div>
              </CardContainer>
            )
          )}
        </>
      )}

      {/* Validation Message */}
      <ValidationMessage
        show={forceValidation && (itemsBeingEdited.size > 0 || isCreating)}
        foreignList={foreignList}
        localList={localList}
      />
    </div>
  );
}
