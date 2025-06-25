/**
 * Get list metadata by path - following Keystone's pattern
 */

'use server'

import { getAdminMetaAction } from './getAdminMetaAction'
import { getGqlNames } from '../lib/getGqlNames'

export async function getListByPath(path: string) {
  try {
    const response = await getAdminMetaAction()
    
    if (!response.success) {
      return undefined
    }

    const adminMeta = response.data
    if (!adminMeta?.lists) {
      return undefined
    }

    // Find the list by path
    const list = adminMeta.lists.find((l: any) => l.path === path)
    
    if (!list) {
      return undefined
    }

    // Transform fields into a record for easier access
    const fields: Record<string, any> = {}
    list.fields.forEach((field: any) => {
      fields[field.path] = field
    })

    // Generate GraphQL names using Keystone's exact function
    const graphqlNames = getGqlNames({
      listKey: list.key,
      pluralGraphQLName: list.plural || list.key + 's'
    })

    return {
      ...list,
      fields, // Return fields as a record
      graphql: {
        names: graphqlNames
      }
    }
  } catch (error) {
    console.error('Error in getListByPath:', error)
    return undefined
  }
}