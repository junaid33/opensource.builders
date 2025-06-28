/**
 * Server action to fetch alternatives for a given proprietary tool
 * Now integrated with buildWhereClause for URL-based filtering
 */

'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'
import { buildWhereClause } from '@/features/dashboard/lib/buildWhereClause'
import { TOOLS_LIST_DEFINITION } from '../lib/hardcodedToolsList'

interface FilterOptions {
  categories?: string[]
  licenses?: string[]
  githubStars?: string[]
  features?: string[]
}

async function fetchAlternativesServer(searchParams: Record<string, any> = {}) {
  // Extract proprietary tool filter to determine which alternatives to fetch
  let proprietaryToolWhere: any = {}
  let openSourceToolWhere: any = {}
  
  // Check if we have a proprietaryTool filter in the searchParams
  const proprietaryToolFilter = Object.keys(searchParams).find(key => key.startsWith('!proprietaryTool_'))
  
  if (proprietaryToolFilter) {
    // Parse the filter to get the proprietary tool criteria
    const filterType = proprietaryToolFilter.replace('!proprietaryTool_', '')
    const filterValue = searchParams[proprietaryToolFilter]
    
    try {
      const value = JSON.parse(filterValue)
      
      if (filterType === 'is') {
        proprietaryToolWhere = { id: { equals: value } }
      } else if (filterType === 'is_i') {
        proprietaryToolWhere = { name: { equals: value, mode: 'insensitive' } }
      }
      // Add more filter types as needed
    } catch (err) {
      console.error('Failed to parse proprietaryTool filter:', err)
      return { success: false, error: 'Invalid proprietaryTool filter', data: { proprietaryTool: [], alternatives: [] } }
    }
  } else {
    // Default to Shopify if no proprietary tool specified
    const proprietaryToolName = searchParams.proprietaryTool || 'Shopify'
    proprietaryToolWhere = { name: { equals: proprietaryToolName, mode: 'insensitive' } }
  }
  
  // For openSourceTool filtering, use the remaining filters
  const openSourceFilters = { ...searchParams }
  // Remove proprietaryTool filters from openSource filtering
  Object.keys(openSourceFilters).forEach(key => {
    if (key.startsWith('!proprietaryTool_') || key === 'proprietaryTool') {
      delete openSourceFilters[key]
    }
  })
  
  if (Object.keys(openSourceFilters).length > 0) {
    openSourceToolWhere = buildWhereClause(TOOLS_LIST_DEFINITION, openSourceFilters)
  }
  
  // Combine filters for alternatives query
  const alternativesWhere: any = {
    proprietaryTool: proprietaryToolWhere
  }
  
  // Add openSourceTool filtering if any filters are specified
  if (Object.keys(openSourceToolWhere).length > 0) {
    alternativesWhere.openSourceTool = openSourceToolWhere
  }

  const query = `
    query GetAlternatives($proprietaryToolWhere: ToolWhereInput!, $alternativesWhere: AlternativeWhereInput!) {
      # Get the proprietary tool and its features
      proprietaryTool: tools(where: $proprietaryToolWhere) {
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
      
      # Get filtered alternatives using buildWhereClause
      alternatives(where: $alternativesWhere) {
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
    proprietaryToolWhere,
    alternativesWhere
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
    data: {
      proprietaryTool: response.data.proprietaryTool,
      alternatives: response.data.alternatives || []
    }
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

// Fetch available features for the sidebar
async function fetchFeaturesServer() {
  const query = `
    query GetFeatures {
      features {
        id
        name
        featureType
        tools {
          id
        }
      }
    }
  `

  const response = await keystoneClient(query, {})
  
  if (!response.success) {
    console.error('Failed to fetch features:', response.error)
    return {
      success: false,
      error: response.error,
      data: []
    }
  }

  // Transform to include tool counts and sort by usage
  const featuresWithCounts = response.data.features.map((feature: any) => ({
    name: feature.name,
    count: feature.tools.length,
    featureType: feature.featureType
  })).filter((feature: any) => feature.count > 0) // Only include features with tools
   .sort((a: any, b: any) => b.count - a.count) // Sort by tool count descending

  return {
    success: true,
    data: featuresWithCounts
  }
}

export { fetchAlternativesServer, fetchCategoriesServer, fetchFeaturesServer, type FilterOptions }