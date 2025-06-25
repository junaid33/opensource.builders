"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  DiamondPlus,
  CirclePlus,
} from "lucide-react";
import { FilterAdd } from "@/features/dashboard/components/FilterAdd";
import { SortSelection } from "@/features/dashboard/components/SortSelection";
import { FilterList } from "@/features/dashboard/components/FilterList";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Define types for the component props
export interface PlatformListMeta {
  key: string;
  path: string;
  label: string;
  singular: string;
  plural: string;
  description?: string;
  labelField?: string;
  initialColumns: string[];
  groups?: string[];
  graphql?: {
    plural: string;
    singular: string;
  };
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

interface PlatformFilterBarProps {
  list: PlatformListMeta;
  currentSort: SortOption | null;
}

export function PlatformFilterBar({
  list,
  currentSort,
}: PlatformFilterBarProps) {
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
  const searchLabels = Object.values(list.fields)
    .filter((field) => field.isFilterable)
    .map((field) => field.label);

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
          <FilterAdd listMeta={list}>
            <Button
              variant="outline"
              size="icon"
              className="lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            >
              <SlidersHorizontal className="stroke-muted-foreground" />
              <span className="hidden lg:inline">Filter</span>
            </Button>
          </FilterAdd>

          <SortSelection listMeta={list} currentSort={currentSort}>
            <Button
              variant="outline"
              size="icon"
              className="lg:px-4 lg:py-2 lg:w-auto rounded-lg"
            >
              <ArrowUpDown className="stroke-muted-foreground" />
              <span className="hidden lg:inline">Sort</span>
            </Button>
          </SortSelection>

          <Link
            href={`/dashboard/platform/${list.path}/create`}
            className={cn(
              buttonVariants(),
              "w-9 lg:w-auto relative lg:ps-12 rounded-lg"
            )}
          >
            <CirclePlus />

            <span className="hidden lg:inline">Create {list.singular}</span>
          </Link>
        </div>
      </div>

      {/* Active Filters */}
      <FilterList listMeta={list} />
    </div>
  );
}
