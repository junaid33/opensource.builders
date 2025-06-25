"use client";

import { useState, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListMeta, SortOption } from '@/features/dashboard/components/FilterBar';
import { cn } from "@/lib/utils";

interface SortSelectionProps {
  listMeta: ListMeta;
  currentSort: SortOption | null;
  children: ReactNode;
}

export function SortSelection({ listMeta, children }: SortSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query: Record<string, string> = {};
  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
  }

  const resetSort = () => {
    const newQueryParams = new URLSearchParams(query);
    newQueryParams.delete("sortBy");
    router.push(`${pathname}?${newQueryParams.toString()}`);
    setIsOpen(false);
  };

  const handleSortChange = (fieldPath: string) => {
    const currentSortBy = searchParams?.get("sortBy");
    let newSortQuery = "";

    if (currentSortBy === fieldPath) {
      // Toggle direction if same field (ASC -> DESC)
      newSortQuery = `-${fieldPath}`;
    } else if (currentSortBy === `-${fieldPath}`) {
      // Toggle direction if same field (DESC -> ASC)
      newSortQuery = fieldPath;
    } else {
      // Default to ASC for new field
      newSortQuery = fieldPath;
    }

    const newQueryParams = new URLSearchParams(query);
    newQueryParams.set("sortBy", newSortQuery);
    router.push(`${pathname}?${newQueryParams.toString()}`);
    setIsOpen(false);
  };

  // If no sort is active, render the default button
  if (!searchParams?.get("sortBy")) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel className="py-1.5">Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {Object.entries(listMeta.fields)
              .filter(([, field]) => field.isOrderable)
              .map(([fieldPath, field]) => (
                <DropdownMenuItem
                  key={fieldPath}
                  onSelect={() => handleSortChange(fieldPath)}
                >
                  <span className="flex items-center justify-between w-full">
                    {field.label}
                  </span>
                </DropdownMenuItem>
              ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const sortBy = searchParams.get("sortBy") || "";
  const field = sortBy.startsWith("-") ? sortBy.slice(1) : sortBy;
  const direction = sortBy.startsWith("-") ? "DESC" : "ASC";

  return (
    <div className="inline-flex divide-x rounded-lg border">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-r-none border-0 px-3 hover:bg-accent"
          >
            <ArrowUpDown className="stroke-muted-foreground" />
            {listMeta.fields[field]?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <div className="flex items-center justify-between py-1.5">
            <DropdownMenuLabel className="py-0">Sort by</DropdownMenuLabel>
            <Badge
              variant="destructive"
              onClick={resetSort}
              className="rounded-sm mr-2 text-[10px] uppercase border tracking-wide font-medium py-0 px-1.5 cursor-pointer"
            >
              Clear
            </Badge>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {Object.entries(listMeta.fields)
              .filter(([, field]) => field.isOrderable)
              .map(([fieldPath, fieldMeta]) => (
                <DropdownMenuItem
                  key={fieldPath}
                  onSelect={() => handleSortChange(fieldPath)}
                >
                  <span className="flex items-center justify-between w-full">
                    {fieldMeta.label}
                    {fieldPath === field && (
                      <Badge className="rounded-sm border py-0 px-1.5 text-[10px] uppercase tracking-wide font-medium">
                        {direction}
                      </Badge>
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        className="bg-muted/40 rounded-l-none border-l border-input pl-3 pr-2 font-normal hover:bg-accent"
        onClick={() => handleSortChange(field)}
      >
        <span className="text-[10px] tracking-wide font-semibold uppercase">
          {direction}
        </span>
        <div className="-space-y-2">
          <ChevronUp
            className={cn(
              "size-3.5",
              direction === "ASC" ? "text-blue-500" : "opacity-30"
            )}
          />
          <ChevronDown
            className={cn(
              "size-3.5",
              direction === "DESC" ? "text-blue-500" : "opacity-30"
            )}
          />
        </div>
      </Button>
    </div>
  );
}