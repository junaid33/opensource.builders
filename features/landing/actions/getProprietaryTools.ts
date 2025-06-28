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

export async function getProprietaryTools(): Promise<Array<{id: string, name: string}>> {
  try {
    const response = await keystoneClient(query)
    
    if (response.success && response.data.alternatives) {
      // Get unique proprietary tools with ID and name
      const toolsMap = new Map()
      response.data.alternatives.forEach((alt: any) => {
        const tool = alt.proprietaryTool
        toolsMap.set(tool.id, { id: tool.id, name: tool.name })
      })
      
      // Convert to array and sort by name
      return Array.from(toolsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching proprietary tools:', error)
    return []
  }
}