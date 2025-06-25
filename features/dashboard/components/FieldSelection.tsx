'use client';

import { useState, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Columns3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListMeta } from './FilterBar';

interface FieldSelectionProps {
  listMeta: ListMeta;
  selectedFields: string[];
  children: ReactNode;
}

function isArrayEqual(arrA: string[], arrB: string[]) {
  if (arrA.length !== arrB.length) return false;
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}

function FieldSelectionContent({
  listMeta,
  selectedFields: currentSelectedFields
}: {
  listMeta: ListMeta;
  selectedFields: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a query object that behaves like the old query object
  const query: Record<string, string> = {};
  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
  }

  const selectedFields = new Set(currentSelectedFields);

  const setNewSelectedFields = (fields: string[]) => {
    if (isArrayEqual(fields, listMeta.initialColumns || [])) {
      const otherQueryFields = { ...query }; // Copy query params
      delete otherQueryFields.fields; // Remove the 'fields' parameter if it exists
      router.push(
        `${pathname}?${new URLSearchParams(otherQueryFields)}`
      );
    } else {
      router.push(
        `${pathname}?${new URLSearchParams({
          ...query,
          fields: fields.join(","),
        })}`
      );
    }
  };

  const fields = Object.entries(listMeta.fields)
    .map(([path, field]) => ({
      value: path,
      label: field.label,
      isDisabled: selectedFields.size === 1 && selectedFields.has(path),
    }));

  return (
    <>
      <DropdownMenuLabel>Display columns</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {fields.map((field) => (
          <DropdownMenuCheckboxItem
            key={field.value}
            checked={selectedFields.has(field.value)}
            onCheckedChange={(checked) => {
              const newSelectedFields = new Set(selectedFields);
              if (checked) {
                newSelectedFields.add(field.value);
              } else {
                newSelectedFields.delete(field.value);
              }
              setNewSelectedFields(Array.from(newSelectedFields));
            }}
            disabled={field.isDisabled}
          >
            {field.label}
          </DropdownMenuCheckboxItem>
        ))}
      </div>
    </>
  );
}

export function FieldSelection({ listMeta, selectedFields, children }: FieldSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const DefaultTrigger = () => (
    <button
      type="button"
      className="flex gap-1.5 pr-2 pl-2 tracking-wider items-center text-xs shadow-sm border p-[.15rem] font-medium text-zinc-600 bg-white dark:bg-zinc-800 rounded-md hover:bg-zinc-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-zinc-600 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-blue-500 dark:focus:text-white"
    >
      <Columns3 size={12} className="stroke-muted-foreground" />
      COLUMNS
    </button>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {children || <DefaultTrigger />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {isOpen && (
          <FieldSelectionContent
            listMeta={listMeta}
            selectedFields={selectedFields}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 