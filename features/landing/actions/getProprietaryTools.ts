'use server'

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
    const response = await fetch('http://localhost:3003/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const data = await response.json()
    
    if (data.data && data.data.alternatives) {
      // Get unique proprietary tool names and sort them
      const proprietaryTools = [...new Set(data.data.alternatives.map((alt: any) => alt.proprietaryTool.name))].sort()
      return proprietaryTools
    }
    
    return []
  } catch (error) {
    console.error('Error fetching proprietary tools:', error)
    return []
  }
}