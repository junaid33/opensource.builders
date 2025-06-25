"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { basePath } from "@/features/dashboard/lib/config";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Columns3,
  DiamondPlus,
  CirclePlus,
} from "lucide-react";
import { FilterAdd } from "./FilterAdd";
import { SortSelection } from "./SortSelection";
import { FieldSelection } from "./FieldSelection";
import { FilterList } from "./FilterList";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Define types for the component props
export interface ListMeta {
  key: string;
  path: string;
  label: string;
  singular: string;
  plural: string;
  initialColumns: string[];
  fields: Record<
    string,
    {
      path: string;
      label: string;
      isFilterable: boolean;
      isOrderable: boolean;
      viewsIndex: number;
    }
  >;
}

export interface SortOption {
  field: string;
  direction: "ASC" | "DESC";
}

export function FilterBar({
  listMeta,
  selectedFields,
}: {
  listMeta: ListMeta;
  selectedFields: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchString, setSearchString] = useState(
    searchParams?.get("search") || ""
  );

  // Create a new URLSearchParams instance to manipulate
  const createQueryString = (
    params: Record<string, string | number | null | undefined>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || "");

    // Update or delete parameters based on the provided object
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    return newSearchParams.toString();
  };

  // Handle search submission
  const updateSearch = (value: string) => {
    const query = createQueryString({
      search: value.trim() || null,
      page: 1, // Reset to first page when search changes
    });
    router.push(`${pathname}?${query}`);
  };

  // Update search string when URL changes
  useEffect(() => {
    setSearchString(searchParams?.get("search") || "");
  }, [searchParams]);

  // Get searchable fields for placeholder
  const searchLabels = Object.values(listMeta.fields)
    .filter((field) => field.isFilterable)
    .map((field) => field.label);

  // Get filterable and orderable fields
  const filterableFields = new Set<string>();
  const orderableFields = new Set<string>();

  Object.entries(listMeta.fields).forEach(([path, field]) => {
    if (field.isFilterable) filterableFields.add(path);
    if (field.isOrderable) orderableFields.add(path);
  });

  // Get current sort from URL
  const sortBy = searchParams?.get("sortBy") || "";
  const currentSortOption = sortBy
    ? ({
        field: sortBy.startsWith("-") ? sortBy.slice(1) : sortBy,
        direction: sortBy.startsWith("-") ? "DESC" : "ASC",
      } as SortOption)
    : null;

  return (
    <div>
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-2 px-4 md:px-6 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSearch(searchString);
            }}
          >
            <Input
              type="search"
              className="pl-9 w-full h-10 rounded-lg placeholder:text-muted-foreground/80 text-sm"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder={`Search by ${
                searchLabels.length
                  ? searchLabels.join(", ").toLowerCase()
                  : "ID"
              }`}
            />
          </form>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          <FilterAdd listMeta={listMeta}>
            <Button
              variant="outline"
              size="icon"
              className="lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            >
              <SlidersHorizontal className="stroke-muted-foreground" />
              <span className="hidden lg:inline">Filter</span>
            </Button>
          </FilterAdd>

          <SortSelection listMeta={listMeta} currentSort={currentSortOption}>
            <Button
              variant="outline"
              size="icon"
              className="lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            >
              <ArrowUpDown className="stroke-muted-foreground" />
              <span className="hidden lg:inline">Sort</span>
            </Button>
          </SortSelection>

          <FieldSelection listMeta={listMeta} selectedFields={selectedFields}>
            <Button
              variant="outline"
              size="icon"
              className="lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            >
              <Columns3 className="stroke-muted-foreground" />
              <span className="hidden lg:inline">Display</span>
            </Button>
          </FieldSelection>

          <Link
            href={`${basePath}/${listMeta.path}/create`}
            className={cn(
              buttonVariants({ size: "icon" }),
              "lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            )}
          >
            <CirclePlus />
            <span className="hidden lg:inline">Create {listMeta.singular}</span>
          </Link>
        </div>
      </div>

      {/* Active Filters */}
      <FilterList listMeta={listMeta} />
    </div>
  );
}
