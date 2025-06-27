/**
 * Get GraphQL names - EXACT COPY from Keystone's types/utils.ts
 */

import pluralize from 'pluralize'

export function humanize(str: string) {
  return str
    .replace(/([a-z])([A-Z]+)/g, '$1 $2')
    .split(/\s|_|-/)
    .filter(i => i)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ')
}

export type GraphQLNames = ReturnType<typeof getGqlNames>

export function getGqlNames({
  listKey,
  pluralGraphQLName,
}: {
  listKey: string
  pluralGraphQLName: string
}) {
  console.log(`\n--- getGqlNames DEBUG ---`)
  console.log(`Input listKey: "${listKey}"`)
  console.log(`Input pluralGraphQLName: "${pluralGraphQLName}"`)
  
  const lowerPluralName = pluralGraphQLName.charAt(0).toLowerCase() + pluralGraphQLName.slice(1)
  const lowerSingularName = listKey.charAt(0).toLowerCase() + listKey.slice(1)
  
  console.log(`Generated lowerPluralName: "${lowerPluralName}"`)
  console.log(`Generated lowerSingularName: "${lowerSingularName}"`)
  console.log(`--- END getGqlNames DEBUG ---\n`)
  return {
    outputTypeName: listKey,
    whereInputName: `${listKey}WhereInput`,
    whereUniqueInputName: `${listKey}WhereUniqueInput`,

    // create
    createInputName: `${listKey}CreateInput`,
    createMutationName: `create${listKey}`,
    createManyMutationName: `create${pluralGraphQLName}`,
    relateToOneForCreateInputName: `${listKey}RelateToOneForCreateInput`,
    relateToManyForCreateInputName: `${listKey}RelateToManyForCreateInput`,

    // read
    itemQueryName: lowerSingularName,
    listQueryName: lowerPluralName,
    listQueryCountName: `${lowerPluralName}Count`,
    listOrderName: `${listKey}OrderByInput`,

    // update
    updateInputName: `${listKey}UpdateInput`,
    updateMutationName: `update${listKey}`,
    updateManyInputName: `${listKey}UpdateArgs`,
    updateManyMutationName: `update${pluralGraphQLName}`,
    relateToOneForUpdateInputName: `${listKey}RelateToOneForUpdateInput`,
    relateToManyForUpdateInputName: `${listKey}RelateToManyForUpdateInput`,

    // delete
    deleteMutationName: `delete${listKey}`,
    deleteManyMutationName: `delete${pluralGraphQLName}`,
  }
}

const labelToPath = (str: string) => str.split(' ').join('-').toLowerCase()
const labelToClass = (str: string) => str.replace(/\s+/g, '')

// WARNING: may break in patch - EXACT COPY from Keystone
export function __getNames(listKey: string, list: { graphql?: { plural?: string }, ui?: any, isSingleton?: boolean }) {
  console.log(`\n=== __getNames DEBUG for listKey: ${listKey} ===`)
  console.log('Input list:', JSON.stringify(list, null, 2))
  
  const { graphql, ui, isSingleton } = list
  if (ui?.path !== undefined && !/^[a-z-_][a-z0-9-_]*$/.test(ui.path)) {
    throw new Error(
      `ui.path for ${listKey} is ${ui.path} but it must only contain lowercase letters, numbers, dashes, and underscores and not start with a number`
    )
  }

  const computedSingular = humanize(listKey)
  console.log(`computedSingular (humanize): "${computedSingular}"`)
  
  const computedPlural = pluralize.plural(computedSingular)
  console.log(`computedPlural (pluralize): "${computedPlural}"`)
  
  const computedLabel = isSingleton ? computedSingular : computedPlural
  console.log(`computedLabel: "${computedLabel}"`)
  
  const path = ui?.path || labelToPath(computedLabel)
  console.log(`path: "${path}"`)

  console.log(`graphql?.plural: "${graphql?.plural}"`)
  console.log(`labelToClass(computedPlural): "${labelToClass(computedPlural)}"`)
  
  const pluralGraphQLName = graphql?.plural ? labelToClass(graphql.plural) : labelToClass(computedPlural)
  console.log(`FINAL pluralGraphQLName: "${pluralGraphQLName}"`)
  
  if (pluralGraphQLName === listKey) {
    throw new Error(
      `The list key and the plural name used in GraphQL must be different but the list key ${listKey} is the same as the plural GraphQL name, please specify graphql.plural`
    )
  }

  const gqlNames = getGqlNames({ listKey, pluralGraphQLName })
  console.log('Generated gqlNames:', JSON.stringify(gqlNames, null, 2))
  console.log(`=== END __getNames DEBUG ===\n`)

  return {
    graphql: {
      names: gqlNames,
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
  }
}

// Helper function to properly generate names with pluralization
// Following Keystone's __getNames pattern from types/utils.ts - EXACT COPY
export function getGraphQLNames(listKey: string, listMeta: { plural?: string }) {
  // Create a complete list config object like Keystone does
  const listConfig = {
    graphql: listMeta.plural ? { plural: listMeta.plural } : undefined,
    ui: undefined,
    isSingleton: false
  }
  return __getNames(listKey, listConfig).graphql.names
}