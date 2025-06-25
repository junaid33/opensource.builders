import React, { useState, useEffect, useCallback } from "react";
import { getRelationshipOptions } from "@/features/dashboard2/actions";
import { Select, MultiSelect } from "./Select";
import type { Option } from "./Select";
import useSWR from "swr";
import { validate as validateUUID } from "uuid";

interface RelationshipSelectProps {
  list: {
    key: string;
  };
  labelField: string;
  isDisabled?: boolean;
  autoFocus?: boolean;
  state: {
    kind: "many" | "one";
    value: any[] | any;
    onChange: (value: any) => void;
  };
  "aria-describedby"?: string;
  extraSelection?: string;
  searchFields?: string[];
  placeholder?: string;
  controlShouldRenderValue?: boolean;
}

// ID validators for different ID field types
const idValidators: Record<string, (value: string) => boolean> = {
  uuid: validateUUID as (value: string) => boolean,
  cuid(value: string) {
    return value.startsWith("c");
  },
  autoincrement(value: string) {
    return /^\d+$/.test(value);
  },
};

// Create filter conditions based on search input
function createFilterConditions(search: string, list: any, searchFields: string[]) {
  if (!search.length || !list) return { OR: [] };

  const idFieldKind = list.fields?.id?.controller?.idFieldKind;
  const trimmedSearch = search.trim();
  const isValidId = idFieldKind && idValidators[idFieldKind]?.(trimmedSearch);

  const conditions = [];
  if (isValidId) {
    conditions.push({ id: { equals: trimmedSearch } });
  }

  for (const fieldKey of searchFields) {
    const field = list.fields?.[fieldKey];
    if (field) {
      conditions.push({
        [field.path]: {
          contains: trimmedSearch,
          mode: field.search === "insensitive" ? "insensitive" : undefined,
        },
      });
    }
  }

  return { OR: conditions };
}

export function RelationshipSelect({
  list,
  labelField,
  isDisabled = false,
  autoFocus = false,
  state,
  "aria-describedby": ariaDescribedby,
  extraSelection = "",
  searchFields = [],
  placeholder = "Search...",
  controlShouldRenderValue = true,
}: RelationshipSelectProps) {
  // Search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [accumulatedOptions, setAccumulatedOptions] = useState<Option[]>([]);
  const PAGE_SIZE = 10;

  // The list already has the GraphQL names from getAdminMetaAction
  const listData = list;

  // Create where clause from search
  const where = createFilterConditions(search, listData, searchFields);

  // Reset accumulated options when search changes
  useEffect(() => {
    setAccumulatedOptions([]);
    setPage(0);
  }, [search]);

  // Fetch options using the list query with search filtering
  const { data: optionsData, isLoading: optionsLoading, error } = useSWR(
    listData && listData.graphql?.names
      ? ["relationshipOptions", list.key, labelField, search, page]
      : null,
    async () => {
      if (!listData || !listData.graphql?.names) {
        throw new Error("List data or graphql names not available");
      }

      const result = await getRelationshipOptions(
        list.key,
        where,
        PAGE_SIZE,
        page * PAGE_SIZE,
        labelField,
        extraSelection,
        {
          whereInputName: listData.graphql.names.whereInputName,
          listQueryName: listData.graphql.names.listQueryName,
          listQueryCountName: listData.graphql.names.listQueryCountName,
        }
      );

      if (result.success) {
        const responseData = result.data ?? { items: [], count: 0 }; // Default if data is null/undefined
        const newOptions = (responseData.items ?? []).map((item: any) => ({
          value: item.id,
          label: item[labelField],
          data: item,
        }));

        // Only accumulate options if this is a "load more" request
        if (page > 0) {
          setAccumulatedOptions((prev) => [...prev, ...newOptions]);
        }

        return {
          items: newOptions,
          count: responseData.count ?? 0,
        };
      } else {
        console.error("Error fetching relationship options (useSWR):", result.error);
        // Return empty data on error
        return { items: [], count: 0 };
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 200,
    }
  );

  const isLoading = optionsLoading;
  const currentOptions =
    page === 0 ? optionsData?.items ?? [] : accumulatedOptions; // Use nullish coalescing

  // Debug information for the query
  const debugQuery = listData && listData.graphql?.names ? `
    query GetOptions($where: ${listData.graphql.names.whereInputName}!, $take: Int!, $skip: Int!) {
      items: ${listData.graphql.names.listQueryName}(where: $where, take: $take, skip: $skip) {
        id
        ${labelField}
        ${extraSelection}
      }
      count: ${listData.graphql.names.listQueryCountName}(where: $where)
    }
  ` : null;

  const debugVariables = {
    where,
    take: PAGE_SIZE,
    skip: page * PAGE_SIZE,
  };

  const handleSearch = useCallback(async (searchValue: string): Promise<Option[]> => {
    setSearch(searchValue);
    setPage(0);
    setAccumulatedOptions([]);

    // Wait for SWR to fetch the data
    if (!listData || !listData.graphql?.names) {
      return [];
    }

    // Use the server action instead of fetchGraphQL
    const result = await getRelationshipOptions(
      list.key,
      createFilterConditions(searchValue, listData, searchFields),
      PAGE_SIZE,
      0,
      labelField,
      extraSelection,
      {
        whereInputName: listData.graphql.names.whereInputName,
        listQueryName: listData.graphql.names.listQueryName,
        listQueryCountName: listData.graphql.names.listQueryCountName,
      }
    );

    if (result.success) {
      // Map items safely, providing default empty array
      return (result.data?.items ?? []).map((item: any) => ({
        value: item.id,
        label: item[labelField],
        data: item,
      }));
    } else {
      console.error("Error fetching relationship options (handleSearch):", result.error);
      return []; // Return empty array on error
    }
  }, [listData, labelField, extraSelection, searchFields, PAGE_SIZE]);

  // Debug card showing the query and variables
  const DebugCard = () => (
    <div style={{ 
      margin: '10px 0', 
      padding: '10px', 
      border: '1px solid #ccc', 
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <strong>🐛 DEBUG: Relationship Query</strong>
      <br />
      <strong>List:</strong> {list?.key || 'NULL LIST'}
      <br />
      <strong>Search:</strong> "{search}"
      <br />
      <strong>Options Count:</strong> {currentOptions.length}
      <br />
      <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
      <br />
      <strong>List Data Available:</strong> {listData ? 'Yes' : 'No'}
      <br />
      <strong>List Key:</strong> {listData?.key}
      <br />
      <strong>List Has gqlNames:</strong> {listData?.graphql?.names ? 'Yes' : 'No'}
      <br />
      <details>
        <summary><strong>List Data:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {JSON.stringify(listData, null, 2)}
        </pre>
      </details>
      <details>
        <summary><strong>GQL Names:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {listData?.graphql?.names ? JSON.stringify(listData.graphql.names, null, 2) : 'No gqlNames found'}
        </pre>
      </details>
      <details>
        <summary><strong>Query:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {debugQuery || 'No query available - check if listData.graphql.names exists'}
        </pre>
      </details>
      <details>
        <summary><strong>Variables:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {JSON.stringify(debugVariables, null, 2)}
        </pre>
      </details>
      <details>
        <summary><strong>Where Clause:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          {JSON.stringify(where, null, 2)}
        </pre>
      </details>
      <details>
        <summary><strong>SWR Response:</strong></summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
          Data: {JSON.stringify(optionsData, null, 2)}
          <br />
          Loading: {optionsLoading}
          <br />
          Error: {JSON.stringify(error, null, 2)}
        </pre>
      </details>
    </div>
  );

  if (state.kind === "many") {
    return (
      <div>
        <DebugCard />
        <MultiSelect
          value={state.value?.map((item: any) => ({
            value: item.id,
            label: item.label || item[labelField],
            data: item,
          })) || []}
          onChange={(value) => {
            state.onChange(
              value.map((x) => ({ id: x.value, label: x.label, data: x.data }))
            );
          }}
          onInputChange={handleSearch}
          isDisabled={isDisabled}
          autoFocus={autoFocus}
          isLoading={isLoading}
          options={currentOptions}
          aria-describedby={ariaDescribedby}
          placeholder={placeholder}
          controlShouldRenderValue={controlShouldRenderValue}
        />
      </div>
    );
  }

  return (
    <div>
      <DebugCard />
      <Select
        value={
          state.value
            ? {
                value: state.value.id,
                label: state.value.label || state.value[labelField],
                data: state.value,
              }
            : null
        }
        onChange={(value) => {
          // Make sure we're passing the correct format to state.onChange
          // This is critical for the form system to work correctly
          state.onChange(
            value
              ? {
                  id: value.value,
                  label: value.label,
                  data: value.data,
                }
              : null
          );
        }}
        onInputChange={handleSearch}
        isDisabled={isDisabled}
        autoFocus={autoFocus}
        isLoading={isLoading}
        options={currentOptions}
        aria-describedby={ariaDescribedby}
        placeholder={placeholder}
        controlShouldRenderValue={controlShouldRenderValue}
      />
    </div>
  );
}
