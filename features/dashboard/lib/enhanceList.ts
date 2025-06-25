import { getFieldTypeFromViewsIndex, getField } from '@/features/dashboard/views/registry';
import type { Field, List } from '@/features/dashboard/types';
import { getGqlNames } from '@/features/dashboard/lib/get-names-from-list';

interface ClientEnhanceListOptions {
  customViews?: Record<string, any>;
}

/**
 * Enhances a list for server-side usage.
 * Adds:
 * - Search fields configuration
 * - GQL names
 * - Basic field processing
 */
export function enhanceListServer(list: List): List {
  // Process fields into a map keyed by field path
  const enhancedFields = Object.entries(list.fields).reduce((acc, [_, field]) => {
    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType);
    
    // Base field structure
    const processedField: Field = {
      ...field,
      description: field.description || null,
    };

    // Server-side controller logic removed as FieldImplementation doesn't define a top-level controller

    acc[field.path] = processedField;
    return acc;
  }, {} as Record<string, Field>);

  // Build enhanced list
  const enhancedList: List = {
    ...list,
    fields: enhancedFields,
  };

  // Add searchable fields (as a new property, not on ListMeta type)
  (enhancedList as any).searchFields = Object.values(list.fields)
    .filter(field => field.isFilterable)
    .map(field => field.path);

  // Always add GQL names
  if (!list.gqlNames) {
    enhancedList.gqlNames = getGqlNames({
      listKey: list.key,
      pluralGraphQLName: list.plural,
    });
  }

  return enhancedList;
}

/**
 * Enhances a list for client-side usage.
 * Adds all server-side enhancements plus:
 * - UI Components (Field, Cell, Filter, CardValue)
 * - Custom views handling
 * - Client-side controllers
 * - Item view metadata
 * - GraphQL metadata
 */
export function enhanceListClient(list: List, options: ClientEnhanceListOptions = {}): List {
  // Assume list is already server-enhanced, just add client-side enhancements
  const enhancedFields = Object.entries(list.fields).reduce((acc, [_, field]) => {
    const fieldType = getFieldTypeFromViewsIndex(field.viewsIndex);
    const fieldImpl = getField(fieldType);
    
    const processedField: Field = {
      ...field,
    };

    // Add client-side views
    const views = {
      Field: fieldImpl?.client?.Field,
      Cell: fieldImpl?.client?.Cell,
      Filter: fieldImpl?.client?.Filter,
      CardValue: fieldImpl?.client?.CardValue,
      controller: fieldImpl?.client?.controller
    };

    // Custom views logic removed as FieldImplementation.client doesn't define customViews

    processedField.views = views;

    // Add client-side controller
    if (fieldImpl?.client?.controller) {
      processedField.controller = fieldImpl.client.controller({
        listKey: list.key,
        fieldMeta: field.fieldMeta,
        label: field.label,
        description: field.description || null,
        path: field.path,
        customViews: {},
      });
    }

    // Add item view metadata
    processedField.itemView = {
      fieldMode: field.itemView?.fieldMode ?? undefined,
      fieldPosition: field.itemView?.fieldPosition ?? undefined,
    };

    processedField.graphql = {
      isNonNull: field.isNonNull
    };

    acc[field.path] = processedField;
    return acc;
  }, {} as Record<string, Field>);

  return {
    ...list,
    fields: enhancedFields,
  };
}

// Deprecated enhanceList function removed. Use enhanceListServer or enhanceListClient directly.