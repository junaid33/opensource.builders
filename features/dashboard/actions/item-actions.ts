'use server'

import { revalidatePath } from 'next/cache'
import { keystoneClient } from '../lib/keystoneClient'

// Server actions following Keystone's exact mutation pattern
export async function updateItemAction(listKey: string, id: string, data: Record<string, unknown>) {
  try {
    console.log('UPDATE_ITEM_ACTION:', { listKey, id, data })
    
    // Build GraphQL mutation following Keystone's exact pattern
    const mutation = `
      mutation ($id: ID!, $data: ${listKey}UpdateInput!) {
        item: update${listKey}(where: { id: $id }, data: $data) {
          id
        }
      }
    `
    
    const response = await keystoneClient(mutation, { id, data })
    
    if (!response.success) {
      // Return Apollo-style errors array from GraphQL response
      return {
        errors: response.errors || [{ message: response.error || 'Update failed', path: undefined }],
        data: response.data || null
      }
    }
    
    // Revalidate paths on successful update
    revalidatePath(`/dashboard/(admin)/${listKey}/${id}`)
    revalidatePath(`/dashboard/(admin)/${listKey}`)
    
    // Return Apollo-style response with empty errors array on success
    return { 
      errors: [] as Array<{ message: string; path?: (string | number)[] }>,
      data: response.data
    }
  } catch (error) {
    // Return error in Apollo format
    return {
      errors: [{ message: error instanceof Error ? error.message : 'Update failed', path: undefined }],
      data: null
    }
  }
}

export async function createItemAction(listKey: string, data: Record<string, unknown>, selectedFields: string = 'id') {
  try {
    console.log('CREATE_ITEM_ACTION:', { listKey, data })
    
    // Build GraphQL mutation following Keystone's exact pattern
    const mutation = `
      mutation ($data: ${listKey}CreateInput!) {
        item: create${listKey}(data: $data) {
          ${selectedFields}
        }
      }
    `
    
    const response = await keystoneClient(mutation, { data })
    
    if (!response.success) {
      // Return Apollo-style errors array from GraphQL response
      return {
        errors: response.errors || [{ message: response.error || 'Create failed', path: undefined }],
        data: null
      }
    }
    
    // Revalidate paths on successful create
    revalidatePath(`/dashboard/(admin)/${listKey}`)
    
    // Return Apollo-style response with empty errors array on success
    return { 
      errors: [] as Array<{ message: string; path?: (string | number)[] }>,
      data: response.data
    }
  } catch (error) {
    // Return error in Apollo format
    return {
      errors: [{ message: error instanceof Error ? error.message : 'Create failed', path: undefined }],
      data: null
    }
  }
}

export async function deleteItemAction(listKey: string, id: string) {
  try {
    console.log('DELETE_ITEM_ACTION:', { listKey, id })
    
    // Build GraphQL mutation following Keystone's exact pattern
    const mutation = `
      mutation ($id: ID!) {
        delete${listKey}(where: { id: $id }) {
          id
        }
      }
    `
    
    const response = await keystoneClient(mutation, { id })
    
    if (!response.success) {
      // Return Apollo-style errors array from GraphQL response
      return {
        errors: response.errors || [{ message: response.error || 'Delete failed', path: undefined }],
        data: null
      }
    }
    
    // Revalidate paths on successful delete
    revalidatePath(`/dashboard/(admin)/${listKey}`)
    
    // Return Apollo-style response with empty errors array on success
    return {
      errors: [] as Array<{ message: string; path?: (string | number)[] }>,
      data: response.data
    }
  } catch (error) {
    // Return error in Apollo format
    return {
      errors: [{ message: error instanceof Error ? error.message : 'Delete failed', path: undefined }],
      data: null
    }
  }
}