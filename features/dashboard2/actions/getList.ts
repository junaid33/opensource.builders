/**
 * Get list metadata by listKey - for relationships and other cases where we don't have the path
 */

'use server'

import { getAdminMetaAction } from './getAdminMetaAction'
import { getGqlNames } from '../lib/getGqlNames'

export async function getList(listKey: string) {
  try {
    const response = await getAdminMetaAction(listKey)
    
    if (!response.success) {
      return null
    }

    const list = response.data.list
    
    if (!list) {
      return null
    }

    // Generate GraphQL names using Keystone's exact function
    const graphqlNames = getGqlNames({
      listKey: list.key,
      pluralGraphQLName: list.plural || list.key + 's'
    })

    return {
      ...list,
      graphql: {
        names: graphqlNames
      }
    }
  } catch (error) {
    console.error('Error in getList:', error)
    return null
  }
}