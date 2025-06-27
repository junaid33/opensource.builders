"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, X } from "lucide-react";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { CreateItemDrawer } from "./CreateItemDrawer";
import { RelationshipSelect } from "./RelationshipSelect";

interface RelationshipValue {
  id: string;
  label: string;
  built?: boolean;
  data?: Record<string, unknown>;
}

interface CardsProps {
  field: any;
  value: {
    kind: 'many' | 'one';
    value: RelationshipValue[] | RelationshipValue | null;
    initialValue: RelationshipValue[] | RelationshipValue | null;
  };
  list: any;
  foreignList: any;
  forceValidation?: boolean;
  autoFocus?: boolean;
  onChange?: (newValue: any) => void;
  isDisabled?: boolean;
}

export function Cards({ 
  field, 
  value, 
  list, 
  foreignList, 
  forceValidation,
  autoFocus,
  onChange,
  isDisabled = false
}: CardsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [counter, setCounter] = useState(1);
  
  const isReadOnly = !onChange || isDisabled;
  const isMany = value.kind === 'many';
  const currentValue = value.value;
  const items = isMany ? (currentValue as RelationshipValue[] || []) : (currentValue ? [currentValue as RelationshipValue] : []);

  // Handle inline creation following Keystone's exact pattern
  const handleCreateItem = (builtItemData: Record<string, unknown>) => {
    if (!onChange) return;

    const id = `_____temporary_${counter}`;
    const label = (builtItemData?.[foreignList.labelField] as string | null) ?? 
                  `[Unnamed ${foreignList.singular} ${counter}]`;
    
    setCounter(counter + 1);
    
    const newItem: RelationshipValue = {
      id,
      label,
      data: builtItemData,
      built: true,
    };

    if (isMany) {
      onChange({
        ...value,
        value: [...items, newItem],
      });
    } else {
      onChange({
        ...value,
        value: newItem,
      });
    }
  };

  // Handle removing items
  const handleRemoveItem = (itemId: string) => {
    if (!onChange || isReadOnly) return;

    if (isMany) {
      onChange({
        ...value,
        value: items.filter(item => item.id !== itemId),
      });
    } else {
      onChange({
        ...value,
        value: null,
      });
    }
  };

  // Handle selection changes from the combobox
  const handleSelectionChange = (newItems: RelationshipValue[] | RelationshipValue | null) => {
    if (!onChange) return;
    
    onChange({
      ...value,
      value: newItems,
    });
  };

  // Build external link for viewing related items
  const getViewHref = () => {
    if (isMany && items.length > 0) {
      // Show filtered list of all related items
      const ids = items.filter(item => !item.built).map(item => item.id);
      if (ids.length > 0) {
        return `/${foreignList.path}?!id_in=${JSON.stringify(ids)}`;
      }
    } else if (!isMany && currentValue && !(currentValue as RelationshipValue).built) {
      // Direct link to single item
      return `/${foreignList.path}/${(currentValue as RelationshipValue).id}`;
    }
    return null;
  };

  const viewHref = getViewHref();
  const showCreateButton = !field.hideCreate && !isReadOnly;
  
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path} className="flex items-center justify-between">
        <span>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-1">*</span>}
        </span>
        
        <div className="flex gap-1">
          {showCreateButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="h-7 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add {foreignList.singular}
            </Button>
          )}
          
          {viewHref && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-7 px-2"
            >
              <a href={viewHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </FieldLabel>

      <div className="space-y-3">
        {/* Selection Interface */}
        <RelationshipSelect
          list={foreignList}
          labelField={foreignList.labelField}
          state={{
            kind: value.kind,
            value: value.value,
            onChange: handleSelectionChange
          }}
          autoFocus={autoFocus}
          isDisabled={isReadOnly}
        />

        {/* Display selected items as badges */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge 
                key={item.id} 
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                <span>{item.label || item.id}</span>
                {!item.built && (
                  <a 
                    href={`/${foreignList.path}/${item.id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No related {foreignList.plural.toLowerCase()}…
          </p>
        )}
      </div>

      {/* Create Item Drawer */}
      <CreateItemDrawer
        listKey={foreignList.key}

        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateItem}
      />
    </FieldContainer>
  );
}