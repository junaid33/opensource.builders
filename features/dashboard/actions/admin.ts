"use server";

import { revalidatePath } from "next/cache";
import { keystoneClient } from "@/features/dashboard/lib/keystoneClient";
import type {
  AdminMeta,
  FieldMeta,
  ListMeta,
} from "@/features/dashboard/types";
import type { FieldMeta as Field } from "@/features/dashboard/types";
import { getGqlNames } from "@/features/dashboard/lib/get-names-from-list";
import { getSelectedFields } from "@/features/dashboard/lib/fields"; // Assuming this path is correct relative to project root
import { buildGraphQLSelections } from "@/features/dashboard/lib/buildGraphQLSelections";
import { buildWhereClause } from "@/features/dashboard/lib/buildWhereClause";
import { buildOrderByClause } from "@/features/dashboard/lib/buildOrderByClause";
import { enhanceListServer } from "@/features/dashboard/lib/enhanceList";

// Item Operations
export async function deleteItem(
  listKey: string,
  id: string,
  gqlNames: { deleteMutationName: string }
) {
  try {
    const query = `
      mutation ($id: ID!) {
        ${gqlNames.deleteMutationName}(where: { id: $id }) {
          id
        }
      }
    `;
    const response = await keystoneClient(query, { id });
    if (response.success) {
      revalidatePath(`/${listKey}`);
    }
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting the item");
  }
}

export async function updateItem(
  listKey: string,
  id: string,
  data: Record<string, unknown>,
  gqlNames: { updateMutationName: string; updateInputName: string }
) {
  try {
    const query = `
      mutation ($data: ${gqlNames.updateInputName}!, $id: ID!) {
        item: ${gqlNames.updateMutationName}(where: { id: $id }, data: $data) {
          id
        }
      }
    `;
    const response = await keystoneClient(query, { id, data });
    if (response.success && response.data?.item?.id) {
      revalidatePath(`/${listKey}/${id}`);
    }
    // Return the whole response object (includes success/error status)
    return response;
  } catch (error) {
    console.error("Error updating item:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while updating the item";
    return { success: false, error: errorMessage };
  }
}

export async function createItem(
  listKey: string,
  data: Record<string, unknown>,
  gqlNames: { createMutationName: string; createInputName: string },
  selectedFields: string = "id"
) {
  try {
    const query = `
      mutation ($data: ${gqlNames.createInputName}!) {
        item: ${gqlNames.createMutationName}(data: $data) {
          ${selectedFields}
        }
      }
    `;
    const response = await keystoneClient(query, { data });
    // No revalidation needed here based on original commented-out code
    // Return the whole response object
    return response;
  } catch (error) {
    console.error("Error creating item:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating the item";
    return { success: false, error: errorMessage };
  }
}

// Relationship Operations
export async function searchItems(
  listKey: string,
  searchFields: string[],
  searchTerm: string,
  gqlNames: {
    listQueryName: string;
    listQueryCountName: string;
    whereInputName: string;
  },
  selectedFields: string,
  take = 10,
  skip = 0
) {
  const query = `
    query Search($where: ${gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
      items: ${gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
        ${selectedFields}
      }
      count: ${gqlNames.listQueryCountName}(where: $where)
    }
  `;

  const where = {
    OR: searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })),
  };

  return keystoneClient(query, { where, take, skip });
}

// Admin Meta Operations
export async function getList(listKey: string) {
  const query = `
    query GetList($listKey: String!) {
      list(key: $listKey) {
        key
        path
        label
        singular
        plural
        description
        labelField
        gqlNames {
          listQueryName
          itemQueryName
          listQueryCountName
          listOrderName
          deleteMutationName
          updateMutationName
          createMutationName
          whereInputName
          whereUniqueInputName
          updateInputName
          createInputName
        }
      }
    }
  `;

  const response = await keystoneClient(query, { listKey });
  // Return the entire KeystoneResponse object
  return response;
}

export async function getItem(
  listKey: string,
  id: string,
  selectedFields: string
) {
  // Call getList and handle the KeystoneResponse
  const listResponse = await getList(listKey);
  if (!listResponse.success) {
    // If getList failed, return its error response
    return listResponse;
  }

  // Extract the list data if successful
  const list = listResponse.data; // list is now the actual list object from the data property
  if (!list) {
    // This case might occur if the API returns success: true but data is unexpectedly null/undefined
    return {
      success: false,
      error: `List ${listKey} data not found even though API call succeeded.`,
    };
    // Or throw new Error(`List ${listKey} data not found even though API call succeeded.`); depending on desired handling
  }
  // Original check for list existence based on listKey is implicitly handled by listResponse.success check now.
  // If listResponse was successful, listResponse.data should contain the list meta.

  const query = `
    query($id: ID!) {
      ${list.gqlNames.itemQueryName}(where: { id: $id }) {
        ${selectedFields}
      }
    }
  `;

  // Fetch the item and return the entire KeystoneResponse object
  const response = await keystoneClient(query, { id });
  return response;
}

export async function getAdminMeta(): Promise<AdminMeta> {
  console.log("Executing getAdminMeta (Server Action)");
  try {
    const query = `
      query {
        keystone {
          adminMeta {
            lists {
              key
              itemQueryName
              listQueryName
              initialSort {
                field
                direction
              }
              path
              label
              singular
              plural
              description
              initialColumns
              initialSearchFields
              pageSize
              labelField
              isSingleton
              isHidden
              hideCreate
              hideDelete
              groups {
                label
                description
                fields {
                  path
                }
              }
              fields {
                path
                label
                isOrderable
                isFilterable
                fieldMeta
                viewsIndex
                customViewsIndex
                isNonNull
                search
                createView {
                  fieldMode
                }
                itemView {
                  fieldMode
                  fieldPosition
                }
                listView {
                  fieldMode
                }
              }
            }
          }
        }
      }
    `;
    const response = await keystoneClient(
      query,
      {},
      {
        next: {
          revalidate: false, // Cache indefinitely since admin meta only changes on deploy
          tags: ["admin-meta"],
        },
      }
    );

    if (!response.success) {
      throw new Error(`Failed to fetch admin meta: ${response.error}`);
    }

    const rawAdminMeta = response.data?.keystone?.adminMeta;

    if (!rawAdminMeta) {
      throw new Error("Admin meta not found in GraphQL response");
    }

    // Transform the raw lists into the correct shape
    const lists: Record<string, ListMeta> = {};
    const listsByPath: Record<string, ListMeta> = {};

    rawAdminMeta.lists.forEach((rawList: any) => {
      // Skip hidden lists
      if (rawList.isHidden) {
        return;
      }

      // Transform fields array into a record
      const fields: Record<string, FieldMeta> = {};
      rawList.fields.forEach((field: any) => {
        if (field?.path) {
          fields[field.path] = field as FieldMeta;
        }
      });

      // Transform groups
      const groups =
        rawList.groups?.map((group: any) => ({
          label: group.label,
          description: group.description,
          fields: group.fields
            .map((field: { path: string }) => fields[field.path])
            .filter(Boolean),
        })) || [];

      // Create the enhanced list with proper types
      const baseList: ListMeta = {
        ...rawList,
        fields,
        groups,
        graphql: {
          names: getGqlNames({
            listKey: rawList.key,
            pluralGraphQLName: rawList.listQueryName,
          }),
        },
        initialSort: rawList.initialSort || null,
        hideNavigation: rawList.isHidden || false,
        hideCreate: rawList.hideCreate || false,
        hideDelete: rawList.hideDelete || false,
        isSingleton: rawList.isSingleton || false,
        pageSize: rawList.pageSize || 50,
        initialColumns: rawList.initialColumns || [],
        initialSearchFields: rawList.initialSearchFields || [],
      };

      // Add gqlNames for backward compatibility
      baseList.gqlNames = baseList.graphql.names;

      // Apply server-side enhancement
      const enhancedList = enhanceListServer(baseList);

      // Add to both maps
      lists[rawList.key] = enhancedList;
      listsByPath[rawList.path] = enhancedList;
    });

    return {
      lists,
      listsByPath,
    };
  } catch (error) {
    console.error("Server Action failed to fetch admin meta:", error);
    throw new Error("Failed to fetch admin meta data.");
  }
}

export async function getAdminLists() {
  const query = `
    query {
      keystone {
        adminMeta {
          lists {
            key
            path
            label
            isHidden
          }
        }
      }
    }
  `;
  const response = await keystoneClient(query);
  return response;
}

export async function getListByPath(
  path: string
): Promise<ListMeta | undefined> {
  const adminMeta = await getAdminMeta();
  return adminMeta.listsByPath?.[path];
}

export async function updateItemInline(
  listKey: string,
  id: string,
  data: Record<string, unknown>,
  selectedFields: string,
  gqlNames: {
    updateInputName: string;
    updateMutationName: string;
  }
) {
  try {
    const query = `
      mutation($data: ${gqlNames.updateInputName}!, $id: ID!) {
        item: ${gqlNames.updateMutationName}(where: { id: $id }, data: $data) {
          ${selectedFields}
        }
      }
    `;

    const response = await keystoneClient(query, { data, id });
    if (response.success && response.data?.item) {
      revalidatePath(`/${listKey}/${id}`);
    }
    return response;
  } catch (error) {
    console.error("Error updating item inline:", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while updating the item inline"
        );
  }
}

export async function getRelationshipOptions(
  _listKey: string, // Prefix with underscore to indicate it's not used
  where: Record<string, unknown>,
  take: number,
  skip: number,
  labelField: string,
  extraSelection: string,
  gqlNames: {
    whereInputName: string;
    listQueryName: string;
    listQueryCountName: string;
  }
) {
  const query = `
    query GetOptions($where: ${gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
      items: ${gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
        id
        ${labelField}
        ${extraSelection}
      }
      count: ${gqlNames.listQueryCountName}(where: $where)
    }
  `;

  const response = await keystoneClient(query, {
    where,
    take,
    skip,
  });

  // Return the entire response object directly
  return response;
}

export async function getListCounts(
  lists: Array<{
    key: string;
    isSingleton?: boolean;
    graphql?: {
      names: import("@/features/dashboard/lib/get-names-from-list").GraphQLNames;
    };
  }>
) {
  try {
    // Skip counting for singleton lists
    const listsToCount = lists.filter((list) => !list.isSingleton);

    if (listsToCount.length === 0) return {};

    // Build a query to get counts for all non-singleton lists at once
    const countQueries = listsToCount.map((list) => {
      const countName =
        list.graphql?.names?.listQueryCountName || `${list.key}Count`;
      return `${list.key}: ${countName}`;
    });

    const query = `query { ${countQueries.join("\n")} }`;
    const response = await keystoneClient(
      query,
      {},
      {
        next: {
          revalidate: 60, // Cache for 1 minute since counts change frequently
          tags: ["list-counts"],
        },
      }
    );

    return response;
  } catch (error: unknown) {
    console.error("Error fetching list counts:", error);
    // Return a KeystoneResponse compatible error object
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error fetching list counts";
    return { success: false, error: errorMessage };
  }
}

export async function deleteManyItems(
  listKey: string,
  ids: string[],
  gqlNames: { deleteManyMutationName: string; whereUniqueInputName: string }
) {
  console.log({gqlNames})
  try {
    const query = `
      mutation DeleteItems($where: [${gqlNames.whereUniqueInputName}!]!) {
        items: ${gqlNames.deleteManyMutationName}(where: $where) {
          id
        }
      }
    `;

    const response = await keystoneClient(query, {
      where: ids.map((id) => ({ id })),
    });
    // Revalidate only on successful deletion with items returned
    if (response.success && response.data?.items) {
      revalidatePath(`/${listKey}`);
    }

    return response; // Return the full KeystoneResponse
  } catch (error) {
    console.error("Error deleting items:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting the items");
  }
}

// New action to fetch list data using Keystone client
export async function getListDataAction(
  list: ListMeta,
  searchParams: Record<string, string> | URLSearchParams // Use string for search param values
) {
  try {
    // Convert searchParams to a regular object if it's not already
    const searchParamsObj =
      searchParams instanceof URLSearchParams
        ? Object.fromEntries(searchParams.entries())
        : searchParams;

    // Get gqlNames from the list, or generate them if not provided
    const gqlNames =
      list.gqlNames ||
      getGqlNames({
        listKey: list.key,
        pluralGraphQLName: list.plural,
      });

    // Use the exact gqlNames from the list
    const { listQueryName, listQueryCountName, whereInputName, listOrderName } =
      gqlNames;

    // Get pagination parameters
    const page = Number.parseInt(searchParamsObj?.page || "1", 10);
    const pageSize = Number.parseInt(
      searchParamsObj?.pageSize || String(list.pageSize) || "50",
      10
    );

    // Get selected fields using our utility function that handles initialColumns
    const selectedFieldKeys = getSelectedFields(list, searchParamsObj);

    // Get sort configuration using list directly
    const sort = buildOrderByClause(list, searchParamsObj);

    // Get filters using list directly
    const filters = buildWhereClause(list, searchParamsObj);

    // Generate GraphQL selections using list directly
    const graphqlSelections = buildGraphQLSelections(list, selectedFieldKeys);

    // Construct the GraphQL query based on the list metadata and gqlNames
    const query = `
      query ($where: ${whereInputName}, $orderBy: [${listOrderName}!], $take: Int, $skip: Int) {
        items: ${listQueryName}(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
          ${graphqlSelections}
        }
        count: ${listQueryCountName}(where: $where)
      }
    `;

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Execute the query with our Keystone client
    const response = await keystoneClient(query, {
      // Use keystoneClient here
      where: filters,
      orderBy: sort,
      take: pageSize,
      skip,
    });

    // Return the entire KeystoneResponse object directly
    return response;
  } catch (error) {
    console.error("Error fetching list data via action:", error);
    // Return a KeystoneResponse compatible error object
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching list data";
    return { success: false, error: errorMessage };
  }
}

// New action to fetch a single item using Keystone client
export async function getItemAction(
  list: ListMeta,
  id: string,
  searchParams: Record<string, string> = {}, // Use string for search param values
  cacheOptions?: { next?: { tags?: string[]; revalidate?: number } }
) {
  try {
    // Get gqlNames from the list, or generate them if not provided
    const gqlNames =
      list.gqlNames ||
      getGqlNames({
        listKey: list.key,
        pluralGraphQLName: list.plural,
      });

    // Use the exact itemQueryName from the list
    const { itemQueryName } = gqlNames;

    // Get selected fields for the UI (though we fetch all fields)
    // This can be used later if we implement selective field fetching
    getSelectedFields(list, searchParams);

    // Generate GraphQL selections for ALL fields, not just selected ones
    const allFieldKeys = Object.keys(list.fields);
    const graphqlSelections = buildGraphQLSelections(list, allFieldKeys);

    // Construct the GraphQL query based on the list metadata
    const query = `
      query ($id: ID!) {
        item: ${itemQueryName}(where: { id: $id }) {
          ${graphqlSelections}
        }
      }
    `;

    // Execute the query with keystoneClient and cache options if provided
    const response = await keystoneClient(query, { id }, cacheOptions);

    return response;
  } catch (error) {
    console.error(
      `Error fetching item ${id} for list ${list.key} via action:`,
      error
    );
    throw error;
  }
}

export async function updateItemAction(
  listKey: string,
  id: string,
  data: Record<string, unknown>
) {
  try {
    const list = await getListByPath(listKey);
    if (!list) {
      return { success: false, error: `List "${listKey}" not found` };
    }

    // Get gqlNames from the list
    const gqlNames =
      list.gqlNames ||
      getGqlNames({
        listKey: list.key,
        pluralGraphQLName: list.plural,
      });

    const { updateMutationName, updateInputName } = gqlNames;

    // Construct the GraphQL mutation
    const mutation = `
      mutation ($data: ${updateInputName}!, $id: ID!) {
        item: ${updateMutationName}(where: { id: $id }, data: $data) {
          id
          // Add any other fields you want to return after update
        }
      }
    `;

    // Execute the mutation with keystoneClient
    const response = await keystoneClient(mutation, { id, data });

    // Revalidate the item page and list page on successful update with item data
    if (response.success && response.data?.item) {
      revalidatePath(`/dashboard/(admin)/${list.path}/${id}`);
      revalidatePath(`/dashboard/(admin)/${list.path}`);
    }

    // Return the entire response object (includes success/error status)
    return response;
  } catch (error) {
    console.error("Error updating item:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while updating the item";
    return { success: false, error: errorMessage };
  }
}

export async function deleteItemAction(listKey: string, id: string) {
  try {
    const list = await getListByPath(listKey);
    if (!list) {
      return { success: false, error: `List "${listKey}" not found` };
    }

    // Get gqlNames from the list
    const gqlNames =
      list.gqlNames ||
      getGqlNames({
        listKey: list.key,
        pluralGraphQLName: list.plural,
      });

    const { deleteMutationName } = gqlNames;

    // Construct the GraphQL mutation
    const mutation = `
      mutation ($id: ID!) {
        item: ${deleteMutationName}(where: { id: $id }) {
          id
        }
      }
    `;

    // Execute the mutation with keystoneClient
    const response = await keystoneClient(mutation, { id });

    if (response.success && response.data?.item) {
      // Revalidate the list page
      revalidatePath(`/dashboard/(admin)/${list.path}`);
    }

    // Return the entire response object
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while deleting the item";
    return { success: false, error: errorMessage };
  }
}
