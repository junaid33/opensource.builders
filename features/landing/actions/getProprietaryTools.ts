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
      openSourceTool {
        id
      }
    }
  }
`

export async function getProprietaryTools(): Promise<Array<{id: string, name: string, slug: string, simpleIconSlug?: string, simpleIconColor?: string}>> {
  try {
    const response = await keystoneClient(query)
    
    if (response.success && response.data.alternatives) {
      // Get unique proprietary tools that have open source alternatives
      const toolsMap = new Map()
      response.data.alternatives.forEach((alt: any) => {
        if (alt.openSourceTool) { // Only include tools that have alternatives
          const tool = alt.proprietaryTool
          toolsMap.set(tool.id, { 
            id: tool.id, 
            name: tool.name,
            slug: tool.slug,
            simpleIconSlug: tool.simpleIconSlug,
            simpleIconColor: tool.simpleIconColor
          })
        }
      })
      
      // Convert to array and sort by name - show all tools that have alternatives
      return Array.from(toolsMap.values())
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching proprietary tools:', error)
    return []
  }
}