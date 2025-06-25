'use client';

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { X as XIcon, Filter as FilterIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getFieldTypeFromViewsIndex, getField, type FieldImplementation, type FieldMetaType } from '@/features/dashboard/views/registry'; // Import FieldImplementation and FieldMetaType
import { ListMeta } from './FilterBar';

interface Field {
  path: string;
  label: string;
  viewsIndex: number;
  isFilterable: boolean;
  fieldMeta?: {
    kind: string;
    [key: string]: unknown; // Changed any to unknown
  };
  // Removed redundant index signature
}

interface Filter {
  field: string;
  type: string;
  value: unknown; // Changed any to unknown
}

interface FilterPillProps {
  filter: Filter;
  field: Field;
}

interface EditDialogProps extends FilterPillProps {
  onClose: () => void;
}

interface FilterWrapperProps {
  fieldImpl: FieldImplementation;
  operator: string; // Renamed 'type' to 'operator' to match FilterProps
  value: unknown;
  onChange: (value: unknown) => void;
}

// Define interface for the accumulator in possibleFilters
interface PossibleFilterConfig {
  type: string;
  fieldPath: string;
  field: Field; // Using the local Field interface defined above
  filterTypes: Record<string, unknown>; // Assuming filterTypes structure is Record<string, unknown> for now
}

export function FilterList({ listMeta }: { listMeta: ListMeta }) {
  const searchParams = useSearchParams();
  
  // Pre-compute all possible filter combinations
  const possibleFilters = Object.entries(listMeta.fields).reduce((acc, [fieldPath, field]) => {
    if (!field.isFilterable) return acc;
    
    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType);
    
    if (!fieldImpl?.filterTypes?.getFilterTypes) return acc;
    
    // Add all possible filter types for this field
    const filterTypes = fieldImpl.filterTypes.getFilterTypes();
    Object.keys(filterTypes).forEach(type => {
      acc[`!${fieldPath}_${type}`] = {
        type,
        fieldPath,
        field,
        filterTypes
      };
    });
    
    return acc;
  }, {} as Record<string, PossibleFilterConfig>); // Changed any to PossibleFilterConfig
  
  // Get active filters by checking against possible filters
  const activeFilters = Array.from(searchParams?.entries() ?? [])
    .map(([key, value]) => {
      const filterConfig = possibleFilters[key];
      if (!filterConfig) return null;
      
      // Parse the JSON value
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch { // Remove unused _ variable
        parsedValue = value;
      }
      
      const fieldType = getFieldTypeFromViewsIndex(filterConfig.field.viewsIndex);
      const fieldImpl = getField(fieldType);
      
      return {
        id: key,
        fieldPath: filterConfig.fieldPath,
        filterType: filterConfig.type,
        value: parsedValue,
        field: filterConfig.field,
        controller: filterConfig.field.fieldMeta && fieldImpl?.client?.controller
          ? fieldImpl.client.controller({
              listKey: listMeta.key, // Added listKey
              path: filterConfig.field.path,
              label: filterConfig.field.label,
              description: null, // Added description (placeholder)
              customViews: {}, // Added customViews (placeholder)
              fieldMeta: filterConfig.field.fieldMeta as FieldMetaType | undefined,
            })
          : null,
        filterTypes: filterConfig.filterTypes,
        Filter: fieldImpl?.client?.Filter,
        Label: ({ type, value }: { type: string; value: unknown }) => { // Changed any to unknown
          return fieldImpl?.filterTypes?.formatFilterLabel(type, value) ?? '';
        }
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex gap-1.5 border-t bg-muted/40 py-2 px-6 items-center">
      <div className="flex items-center gap-1.5 border-r border-muted-foreground/30 pr-2 mr-1.5">
        <FilterIcon
          className="stroke-muted-foreground/50 size-4"
          strokeWidth={1.5}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {activeFilters.map((filter) => (
          <FilterPill
            key={filter.id}
            filter={{
              field: filter.fieldPath,
              type: filter.filterType,
              value: filter.value
            }}
            field={filter.field}
          />
        ))}
      </div>
    </div>
  );
}

function FilterPill({ filter, field }: FilterPillProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Create a query object that behaves like the old query object
  const query: Record<string, string> = {};
  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
    query[key] = value;
    }
  }

  // Get the field implementation
  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
  const fieldImpl = getField(fieldType);
  
  const filterLabel = fieldImpl?.filterTypes?.formatFilterLabel(filter.type, filter.value) ?? '';

  const onRemove = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() ?? '');
    newSearchParams.delete(`!${filter.field}_${filter.type}`);
    newSearchParams.delete('page');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          className="inline-flex items-center rounded-md text-muted-foreground shadow-xs h-6"
          role="group"
        >
          <div className="flex border rounded-s-md h-full">
            <Button
              variant="ghost"
              size="icon"
              className="max-h-full rounded-none rounded-s-[calc(theme(borderRadius.md)-1px)] [&_svg]:size-3 w-6 h-6 px-2 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <XIcon />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="py-0 shadow-none justify-start uppercase flex-wrap rounded-l-none border-l-0 [&_svg]:size-3.5 text-xs px-2 h-full"
          >
            <span className="opacity-75 truncate">{field.label}</span>
            <ChevronRightIcon />
            <span className="font-semibold truncate">
              {filterLabel}
            </span>
            <ChevronDownIcon />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <EditDialog
          filter={filter}
          field={field}
          onClose={() => setPopoverOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

function FilterWrapper({ fieldImpl, operator, value, onChange }: FilterWrapperProps) { // Use 'operator' prop
  // Check if client and Filter exist
  const Filter = fieldImpl?.client?.Filter;
  if (!Filter) return null;
  
  return (
    <Filter
      operator={operator}
      value={value as string | number | boolean}
      onChange={onChange}
    />
  );
}

function EditDialog({ filter, field, onClose }: EditDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(filter.value);

  const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
  const fieldImpl = getField(fieldType);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams?.toString() ?? '');
    newSearchParams.delete('page');
    newSearchParams.set(`!${filter.field}_${filter.type}`, JSON.stringify(value));
    
    router.push(`${pathname}?${newSearchParams.toString()}`);
    onClose();
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="px-2 pt-3 pb-1">
        <FilterWrapper
          fieldImpl={fieldImpl}
          operator={filter.type}
          value={value}
          onChange={setValue}
        />
      </div>
      <Separator />
      <div className="flex justify-between gap-2 px-2 pb-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
} 