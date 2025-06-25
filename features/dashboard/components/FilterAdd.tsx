'use client';

import { Fragment, useMemo, useState, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getFieldTypeFromViewsIndex, getField } from '@/features/dashboard/views/registry';
import type { BaseField } from '@/features/dashboard/types';
// Removed unused JSONValue import
import type { ListMeta } from '@/features/dashboard/types';
import type { FieldImplementation as RegistryFieldImplementation } from '@/features/dashboard/views/registry';

interface FilterType {
  label: string;
  initialValue: string | number | boolean;
}

interface FilterTypes {
  [key: string]: FilterType;
}

// Removed unused LocalFilterProps interface

interface FilterProps {
  field: BaseField;
  type: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean | null) => void;
  operator: string;
}

interface FilterController {
  filter: {
    types: FilterTypes;
    Filter: React.ComponentType<FilterProps>;
  };
}

interface FilterableField extends Omit<BaseField, 'description'> {
  description?: string | null;
  isFilterable: boolean;
  controller: FilterController;
}

interface FilterState {
  kind: "selecting-field" | "filter-value";
  fieldPath: string | null;
  filterType: string | null;
  filterValue: string | number | boolean | null;
}

interface FilterAddProps {
  listMeta: ListMeta;
  children: ReactNode;
}

interface FilterWrapperProps {
  field: FilterableField;
  fieldImpl: RegistryFieldImplementation;
  type: string;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean | null) => void;
}

function FilterWrapper({ field, fieldImpl, type, value, onChange }: FilterWrapperProps) {
  const Filter = fieldImpl.client?.Filter;
  if (!Filter) return null;
  
  const baseField: BaseField = {
    path: field.path,
    label: field.label,
    description: field.description || undefined,
    viewsIndex: field.viewsIndex,
    fieldMeta: field.fieldMeta
  };
  
  const filterProps: FilterProps = {
    field: baseField,
    type,
    value: value || '',
    onChange,
    operator: type
  };
  
  return <Filter {...filterProps} />;
}

export function FilterAdd({ listMeta, children }: FilterAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get filterable fields with their filter implementations
  const filterableFields = useMemo(() => {
    const fields: Record<string, FilterableField> = {};
    Object.entries(listMeta.fields).forEach(([fieldPath, field]) => {
      if (field.isFilterable) {
        const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
        const fieldImpl = getField(fieldType);
        
        if (fieldImpl?.client?.Filter && fieldImpl.filterTypes?.getFilterTypes) {
          const filterTypes = fieldImpl.filterTypes.getFilterTypes();
          const fieldData: FilterableField = {
            path: field.path,
            label: field.label,
            description: field.description,
            viewsIndex: field.viewsIndex,
            fieldMeta: field.fieldMeta as FilterableField['fieldMeta'],
            isFilterable: field.isFilterable,
            controller: {
              filter: {
                types: filterTypes as unknown as FilterTypes,
                Filter: fieldImpl.client.Filter as unknown as React.ComponentType<FilterProps>
              }
            }
          };
          fields[fieldPath] = fieldData;
        }
      }
    });
    return fields;
  }, [listMeta.fields]);

  const [state, setState] = useState<FilterState>({
    kind: "selecting-field",
    fieldPath: null,
    filterType: null,
    filterValue: null
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (state.kind === "filter-value" && state.fieldPath && state.filterType && state.filterValue !== null && searchParams) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      // Remove the page parameter and add the new filter
      newSearchParams.delete('page');
      const filterKey = `!${state.fieldPath}_${state.filterType}`;
      newSearchParams.set(filterKey, JSON.stringify(state.filterValue));
      
      router.push(`${pathname}?${newSearchParams.toString()}`);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent align="start" className="w-[240px] p-0">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center px-2 py-2">
              {state.kind !== "selecting-field" && (
                <Button
                  onClick={() => setState({ kind: "selecting-field", fieldPath: state.fieldPath, filterType: null, filterValue: null })}
                  variant="ghost"
                  size="icon"
                  className="[&_svg]:size-3 w-6 h-6"
                >
                  <div className="sr-only">Back</div>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="text-sm font-medium">
                {state.kind === "selecting-field"
                  ? "Filter"
                  : state.fieldPath ? listMeta.fields[state.fieldPath].label : ""}
              </div>
            </div>
            <Separator />

            <div className="p-2">
              {state.kind === "selecting-field" && (
                <Select
                  value={state.fieldPath || undefined}
                  onValueChange={(fieldPath) => {
                    if (fieldPath) {
                      const field = filterableFields[fieldPath];
                      const firstFilterType = Object.keys(field.controller.filter.types)[0];
                      setState({
                        kind: "filter-value",
                        fieldPath,
                        filterType: firstFilterType,
                        filterValue: field.controller.filter.types[firstFilterType].initialValue
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue className="text-sm" placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(filterableFields).map(([fieldPath]) => (
                      <SelectItem key={fieldPath} value={fieldPath}>
                        {listMeta.fields[fieldPath].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {state.kind === "filter-value" && state.fieldPath && (
                <>
                  <Select
                    value={state.filterType || ''}
                    onValueChange={(filterType) => {
                      const field = filterableFields[state.fieldPath!];
                      setState({
                        ...state,
                        filterType,
                        filterValue: field.controller.filter.types[filterType].initialValue
                      });
                    }}
                  >
                    <SelectTrigger className="mb-2">
                      <SelectValue>
                        {state.filterType ? filterableFields[state.fieldPath].controller.filter.types[state.filterType].label : 'Select filter type'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(filterableFields[state.fieldPath].controller.filter.types).map(([filterType, { label }]) => (
                        <SelectItem key={filterType} value={filterType}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {state.filterType && (
                    <div className="pb-3">
                      {(() => {
                        const field = filterableFields[state.fieldPath!];
                        const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
                        const fieldImpl = getField(fieldType);
                        
                        return (
                          <FilterWrapper
                            field={field}
                            fieldImpl={fieldImpl}
                            type={state.filterType}
                            value={state.filterValue}
                            onChange={(value: string | number | boolean | null) => {
                              setState({
                                ...state,
                                filterValue: value
                              });
                            }}
                          />
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>

            {state.kind === "filter-value" && (
              <>
                <Separator />
                <div className="flex justify-between p-2">
                  <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Apply
                  </Button>
                </div>
              </>
            )}
          </form>
        </PopoverContent>
      )}
    </Popover>
  );
} 