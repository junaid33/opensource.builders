import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListTable } from '@/features/dashboard/components/ListTable';
import { FilterBarWrapper } from '@/features/dashboard/components/FilterBarWrapper';
import { getListByPath, getListDataAction } from "@/features/dashboard/actions";
import { PageBreadcrumbs } from "@/features/dashboard/components/PageBreadcrumbs";
import { Circle, Square, Triangle } from "lucide-react";
import { buildOrderByClause } from "@/features/dashboard/lib/buildOrderByClause";
import { getSelectedFields } from "@/features/dashboard/lib/fields";
import { notFound } from "next/navigation";

interface ListDataResponse {
  items: any[];
  count: number;
}

interface PageProps {
  params: Promise<{ listKey: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function ErrorDisplay({ title, message }: { title: string; message: string }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-red-600">
        {title}
      </h1>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
}

function ListPageContent({
  list,
  items,
  count,
  currentPage,
  pageSize,
  selectedFields,
  sort,
  cleanedSearchParams,
}: {
  list: any;
  items: any[];
  count: number;
  currentPage: number;
  pageSize: number;
  selectedFields: string[];
  sort: any;
  cleanedSearchParams: Record<string, string>;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="pb-4 pt-4 md:pt-6 px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {list.label}
        </h1>
        <p className="text-muted-foreground">
          {list.description ||
            `Create and manage ${list.label.toLowerCase()}`}
        </p>
      </div>
      <FilterBarWrapper
        list={list}
        selectedFields={selectedFields}
        currentSort={sort}
      />
      <main>
        {items.length > 0 ? (
          <ListTable
            data={{ items, meta: { count } }}
            list={list}
            selectedFields={selectedFields}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <div className="border-t text-center flex flex-col items-center justify-center p-10 h-full">
            <div className="relative h-11 w-11 mx-auto mb-2">
              <Triangle className="absolute left-1 top-1 w-4 h-4 fill-indigo-200 stroke-indigo-400 dark:stroke-indigo-600 dark:fill-indigo-950 rotate-[90deg]" />
              <Square className="absolute right-[.2rem] top-1 w-4 h-4 fill-orange-300 stroke-orange-500 dark:stroke-amber-600 dark:fill-amber-950 rotate-[30deg]" />
              <Circle className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 fill-emerald-200 stroke-emerald-400 dark:stroke-emerald-600 dark:fill-emerald-900" />
            </div>
            <p className="mt-2 text-sm font-medium">
              No {list.label.toLowerCase()}
            </p>
            {cleanedSearchParams.search || 
            Object.keys(cleanedSearchParams).some((key) => 
              key.startsWith("!")
            ) ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Found matching your{" "}
                  {cleanedSearchParams.search ? "search" : "filters"}
                </p>
                <Link href={`/dashboard/${list.path}`}>
                  <Button variant="outline" size="sm" className="h-7 mt-2">
                    Clear filters & search
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Get started by creating a new one.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export async function ListPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { listKey: listKeyParam } = resolvedParams;
  const searchParamsObj = Object.fromEntries(
    Object.entries(resolvedSearchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value : value?.toString(),
    ])
  );

  // Get the list by path using our cached function
  const list = await getListByPath(listKeyParam);

  if (!list) {
    notFound();
  }

  // Convert searchParamsObj to a format compatible with getListDataAction
  const cleanedSearchParams: Record<string, string> = {};
  Object.entries(searchParamsObj).forEach(([key, value]) => {
    if (typeof value === "string") {
      cleanedSearchParams[key] = value;
    } else if (Array.isArray(value)) {
      // Assuming we only care about the first value if it's an array for filters/sort etc.
      // Adjust if multiple values are expected for certain params.
      cleanedSearchParams[key] = value[0] || "";
    }
  });

  // Fetch the list data using the new server action
  const response = await getListDataAction(list, cleanedSearchParams);

  // Check if the action was successful
  if (!response.success) {
    return (
      <ErrorDisplay
        title="Error Fetching Data"
        message={response.error || "An unknown error occurred."}
      />
    );
  }

  // Extract data from the response with proper type handling
  const listData = response.data as ListDataResponse;
  const items = listData.items || [];
  const count = listData.count || 0;

  // Re-calculate values needed by the UI using list meta and search params
  const currentPage = Number.parseInt(cleanedSearchParams?.page || "1", 10);
  const pageSize = Number.parseInt(
    cleanedSearchParams?.pageSize || String(list.pageSize) || "50",
    10
  );
  const selectedFields = getSelectedFields(list, cleanedSearchParams);
  
  // Build sort directly from list
  const sort = buildOrderByClause(list, cleanedSearchParams);

  return (
    <section
      aria-label={`${list.label} overview`}
      className="overflow-hidden flex flex-col"
    >
      <PageBreadcrumbs
        items={[
          {
            type: "link",
            label: "Dashboard",
            href: "/",
          },
          {
            type: "page",
            label: list.label,
            showModelSwitcher: true,
          },
        ]}
      />
      <ListPageContent 
        list={list}
        items={items}
        count={count}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedFields={selectedFields}
        sort={sort}
        cleanedSearchParams={cleanedSearchParams}
      />
    </section>
  );
}

export default ListPage;