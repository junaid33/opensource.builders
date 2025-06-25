import pluralize from "pluralize"

// Helper function to convert labels to paths
export function labelToPath(label: string) {
  return label
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

// Helper function to convert labels to class names
export function labelToClass(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1$2") // Split on case change
    .split(/[^a-zA-Z0-9]/) // Split on non-alphanumeric
    .map((i) => i.charAt(0).toUpperCase() + i.slice(1)) // Capitalize each part
    .join("") // Join back together
}

// Helper function to humanize a string
export function humanize(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
    .replace(/^./, (s) => s.toUpperCase())
}

interface ListConfig {
  graphql?: {
    plural?: string;
  };
  ui?: {
    path?: string;
    label?: string;
    singular?: string;
    plural?: string;
  };
  isSingleton?: boolean;
}

export function getNamesFromList(listKey: string, { graphql, ui, isSingleton }: ListConfig = {}) {
  // Validate path format if provided
  if (ui?.path !== undefined && !/^[a-z-_][a-z0-9-_]*$/.test(ui.path)) {
    throw new Error(
      `ui.path for ${listKey} is ${ui.path} but it must only contain lowercase letters, numbers, dashes, and underscores and not start with a number`
    );
  }

  const computedSingular = humanize(listKey)
  const computedPlural = pluralize.plural(computedSingular)
  const computedLabel = isSingleton ? computedSingular : computedPlural
  const path = ui?.path || labelToPath(computedLabel)

  const pluralGraphQLName = graphql?.plural || labelToClass(computedPlural)
  
  // Validate that list key and plural name are different
  if (pluralGraphQLName === listKey) {
    throw new Error(
      `The list key and the plural name used in GraphQL must be different but the list key ${listKey} is the same as the plural GraphQL name, please specify graphql.plural`
    );
  }

  return {
    graphql: {
      names: getGqlNames({ listKey, pluralGraphQLName }),
      namePlural: pluralGraphQLName,
    },
    ui: {
      labels: {
        label: ui?.label || computedLabel,
        singular: ui?.singular || computedSingular,
        plural: ui?.plural || computedPlural,
        path,
      },
    },
    adminUILabels: {
      label: ui?.label || computedLabel,
      singular: ui?.singular || computedSingular,
      plural: ui?.plural || computedPlural,
      path,
    },
  }
}

export type GraphQLNames = ReturnType<typeof getGqlNames>;

export function getGqlNames({ listKey, pluralGraphQLName }: { listKey: string; pluralGraphQLName: string }) {
  // Remove spaces from pluralGraphQLName for GraphQL compatibility
  const cleanPluralGraphQLName = pluralGraphQLName.replace(/\s+/g, '')
  
  const lowerPluralName = cleanPluralGraphQLName.slice(0, 1).toLowerCase() + cleanPluralGraphQLName.slice(1)
  const lowerSingularName = listKey.slice(0, 1).toLowerCase() + listKey.slice(1)
  return {
    outputTypeName: listKey,
    itemQueryName: lowerSingularName,
    listQueryName: lowerPluralName,
    listQueryCountName: `${lowerPluralName}Count`,
    listOrderName: `${listKey}OrderByInput`,
    deleteMutationName: `delete${listKey}`,
    updateMutationName: `update${listKey}`,
    createMutationName: `create${listKey}`,
    deleteManyMutationName: `delete${cleanPluralGraphQLName}`,
    updateManyMutationName: `update${cleanPluralGraphQLName}`,
    createManyMutationName: `create${cleanPluralGraphQLName}`,
    whereInputName: `${listKey}WhereInput`,
    whereUniqueInputName: `${listKey}WhereUniqueInput`,
    updateInputName: `${listKey}UpdateInput`,
    createInputName: `${listKey}CreateInput`,
    updateManyInputName: `${listKey}UpdateArgs`,
    relateToManyForCreateInputName: `${listKey}RelateToManyForCreateInput`,
    relateToManyForUpdateInputName: `${listKey}RelateToManyForUpdateInput`,
    relateToOneForCreateInputName: `${listKey}RelateToOneForCreateInput`,
    relateToOneForUpdateInputName: `${listKey}RelateToOneForUpdateInput`,
  }
}

