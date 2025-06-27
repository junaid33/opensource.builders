/**
 * Server action to fetch alternatives for a given proprietary tool
 */

'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

interface FilterOptions {
  categories?: string[]
  licenses?: string[]
  githubStars?: string[]
}

function buildWhereClause(filters: FilterOptions) {
  const conditions: any[] = []

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    conditions.push({
      category: {
        name: { in: filters.categories }
      }
    })
  }

  // License filter
  if (filters.licenses && filters.licenses.length > 0) {
    conditions.push({
      license: { in: filters.licenses }
    })
  }

  // GitHub stars filter
  if (filters.githubStars && filters.githubStars.length > 0) {
    const starConditions: any[] = []
    
    filters.githubStars.forEach(range => {
      switch (range) {
        case '1000-5000':
          starConditions.push({
            AND: [
              { githubStars: { gte: 1000 } },
              { githubStars: { lt: 5000 } }
            ]
          })
          break
        case '5000-10000':
          starConditions.push({
            AND: [
              { githubStars: { gte: 5000 } },
              { githubStars: { lt: 10000 } }
            ]
          })
          break
        case '10000+':
          starConditions.push({
            githubStars: { gte: 10000 }
          })
          break
      }
    })
    
    if (starConditions.length > 0) {
      conditions.push({ OR: starConditions })
    }
  }

  return conditions.length > 0 ? { AND: conditions } : {}
}

async function fetchAlternativesServer(proprietaryTool: string, filters: FilterOptions = {}) {
  const query = `
    query GetAlternatives($proprietaryTool: String!) {
      # Get the proprietary tool and its features
      proprietaryTool: tools(where: { name: { equals: $proprietaryTool } }) {
        id
        name
        features {
          feature {
            id
            name
            slug
            description
            featureType
          }
        }
      }
      
      # Get all alternatives - no filtering
      alternatives(where: { 
        proprietaryTool: { 
          name: { equals: $proprietaryTool } 
        }
      }) {
        id
        similarityScore
        openSourceTool {
          id
          name
          slug
          description
          websiteUrl
          repositoryUrl
          logoUrl
          logoSvg
          license
          githubStars
          isOpenSource
          category {
            name
            slug
          }
          features {
            feature {
              id
              name
              slug
              description
              featureType
            }
          }
        }
      }
    }
  `;

  const response = await keystoneClient(query, { 
    proprietaryTool
  })
  
  if (!response.success) {
    console.error('Failed to fetch alternatives:', response.error)
    return { 
      success: false, 
      error: response.error,
      data: { proprietaryTool: [], alternatives: [] }
    }
  }

  return {
    success: true,
    data: response.data
  }
}

// Also fetch categories for the sidebar
async function fetchCategoriesServer() {
  const query = `
    query GetCategories {
      categories {
        id
        name
        slug
        tools {
          id
        }
      }
    }
  `

  const cacheOptions = {
    next: {
      revalidate: 3600, // 1 hour cache for categories
      tags: ['categories']
    }
  }

  const response = await keystoneClient(query, {}, cacheOptions)
  
  if (!response.success) {
    console.error('Failed to fetch categories:', response.error)
    return {
      success: false,
      error: response.error,
      data: []
    }
  }

  // Transform to include tool counts
  const categoriesWithCounts = response.data.categories.map((cat: any) => ({
    name: cat.name,
    count: cat.tools.length
  })).filter((cat: any) => cat.count > 0) // Only include categories with tools
   .sort((a: any, b: any) => b.count - a.count) // Sort by tool count descending

  return {
    success: true,
    data: categoriesWithCounts
  }
}

export { fetchAlternativesServer, fetchCategoriesServer, type FilterOptions }