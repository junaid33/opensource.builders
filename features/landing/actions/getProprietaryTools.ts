'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

const query = `
  query GetProprietaryTools {
    alternatives {
      proprietaryTool {
        id
        name
        slug
      }
    }
  }
`

export async function getProprietaryTools(): Promise<string[]> {
  try {
    const data = await keystoneClient(query)
    
    if (data.alternatives) {
      // Get unique proprietary tool names and sort them
      const proprietaryTools = [...new Set(data.alternatives.map((alt: any) => alt.proprietaryTool.name))].sort()
      return proprietaryTools
    }
    
    return []
  } catch (error) {
    console.error('Error fetching proprietary tools:', error)
    return []
  }
}