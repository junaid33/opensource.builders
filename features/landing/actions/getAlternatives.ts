/**
 * Server action to fetch alternatives for a given proprietary tool
 */

'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

interface FilterOptions {
  categories?: string[]
  licenses?: string[]
  githubStars?: string[]
  features?: string[]
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
      
      # Get all alternatives - we'll filter client-side for now
      alternatives(where: { proprietaryTool: { name: { equals: $proprietaryTool } } }) {
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

  // Apply client-side filtering if filters are provided
  let filteredAlternatives = response.data.alternatives || []
  
  if (filters.features && filters.features.length > 0) {
    filteredAlternatives = filteredAlternatives.filter((altRelation: any) => {
      const alt = altRelation.openSourceTool
      if (!alt?.features) return false
      
      const toolFeatureNames = new Set(alt.features.map((f: any) => f.feature.name))
      
      // Check if tool has ALL selected features (AND logic)
      return filters.features!.every(featureName => toolFeatureNames.has(featureName))
    })
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filteredAlternatives = filteredAlternatives.filter((altRelation: any) => {
      const alt = altRelation.openSourceTool
      return alt?.category && filters.categories!.includes(alt.category.name)
    })
  }
  
  if (filters.licenses && filters.licenses.length > 0) {
    filteredAlternatives = filteredAlternatives.filter((altRelation: any) => {
      const alt = altRelation.openSourceTool
      return alt?.license && filters.licenses!.includes(alt.license)
    })
  }
  
  if (filters.githubStars && filters.githubStars.length > 0) {
    filteredAlternatives = filteredAlternatives.filter((altRelation: any) => {
      const alt = altRelation.openSourceTool
      const stars = alt?.githubStars || 0
      
      return filters.githubStars!.some(range => {
        switch (range) {
          case '1000-5000':
            return stars >= 1000 && stars < 5000
          case '5000-10000':
            return stars >= 5000 && stars < 10000
          case '10000+':
            return stars >= 10000
          default:
            return false
        }
      })
    })
  }

  return {
    success: true,
    data: {
      proprietaryTool: response.data.proprietaryTool,
      alternatives: filteredAlternatives
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