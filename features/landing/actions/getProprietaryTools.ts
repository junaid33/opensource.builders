'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

const query = `
  query GetProprietaryTools {
    alternatives {
      proprietaryTool {
        id
        name
        slug
        simpleIconSlug
        simpleIconColor
      }
    }
  }
`

export async function getProprietaryTools(): Promise<Array<{id: string, name: string, simpleIconSlug?: string, simpleIconColor?: string}>> {
  try {
    const response = await keystoneClient(query)
    
    if (response.success && response.data.alternatives) {
      // Get unique proprietary tools with ID, name, and Simple Icons data
      const toolsMap = new Map()
      response.data.alternatives.forEach((alt: any) => {
        const tool = alt.proprietaryTool
        toolsMap.set(tool.id, { 
          id: tool.id, 
          name: tool.name,
          simpleIconSlug: tool.simpleIconSlug,
          simpleIconColor: tool.simpleIconColor
        })
      })
      
      // Convert to array, filter to target tools, and sort by name
      const targetTools = ['Shopify', 'Notion', 'Tailwind Plus', 'Cursor']
      return Array.from(toolsMap.values())
        .filter(tool => targetTools.includes(tool.name))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching proprietary tools:', error)
    return []
  }
}