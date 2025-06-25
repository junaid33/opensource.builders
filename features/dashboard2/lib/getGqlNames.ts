/**
 * Get GraphQL names - Exact copy from Keystone's types/utils.ts
 */

export type GraphQLNames = ReturnType<typeof getGqlNames>

export function getGqlNames({
  listKey,
  pluralGraphQLName,
}: {
  listKey: string
  pluralGraphQLName: string
}) {
  const lowerPluralName = pluralGraphQLName.charAt(0).toLowerCase() + pluralGraphQLName.slice(1)
  const lowerSingularName = listKey.charAt(0).toLowerCase() + listKey.slice(1)
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