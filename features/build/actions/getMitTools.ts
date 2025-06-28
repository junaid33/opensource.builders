'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'
import type { Tool, FilterOptions } from '../types/build'

interface GetMitToolsResponse {
  success: boolean
  data: Tool[]
  error?: string
}

/**
 * Fetch MIT-licensed open source tools with their features
 */
export async function getMitTools(filters: FilterOptions = {}): Promise<GetMitToolsResponse> {
  const { search, categories, minStars = 0, sortBy = 'stars', sortOrder = 'desc' } = filters

  // Build where clause for filtering
  const whereClause: any = {
    AND: [
      { isOpenSource: { equals: true } },
      { license: { equals: 'MIT' } }
    ]
  }

  // Add search filter
  if (search && search.trim()) {
    whereClause.AND.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  }

  // Add category filter
  if (categories && categories.length > 0) {
    whereClause.AND.push({
      category: {
        slug: { in: categories }
      }
    })
  }

  // Add minimum GitHub stars filter
  if (minStars > 0) {
    whereClause.AND.push({
      githubStars: { gte: minStars }
    })
  }

  // Build order by clause
  let orderBy: any = {}
  switch (sortBy) {
    case 'name':
      orderBy = { name: sortOrder }
      break
    case 'updated':
      orderBy = { updatedAt: sortOrder }
      break
    case 'stars':
    default:
      orderBy = { githubStars: sortOrder }
      break
  }

  const query = `
    query GetMitTools($where: ToolWhereInput!, $orderBy: [ToolOrderByInput!]) {
      tools(where: $where, orderBy: $orderBy) {
        id
        name
        slug
        description
        websiteUrl
        repositoryUrl
        simpleIconSlug
        simpleIconColor
        license
        githubStars
        isOpenSource
        category {
          id
          name
          slug
          color
        }
        features {
          id
          feature {
            id
            name
            slug
            description
            featureType
          }
          implementationNotes
          qualityScore
          verified
        }
      }
    }
  `

  try {
    const response = await keystoneClient(query, { 
      where: whereClause, 
      orderBy: [orderBy] 
    })

    if (!response.success) {
      console.error('Failed to fetch MIT tools:', response.error)
      return {
        success: false,
        data: [],
        error: response.error
      }
    }

    // Transform the response to match our Tool interface
    const tools: Tool[] = response.data.tools.map((tool: any) => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      description: tool.description || '',
      websiteUrl: tool.websiteUrl,
      repositoryUrl: tool.repositoryUrl,
      simpleIconSlug: tool.simpleIconSlug,
      simpleIconColor: tool.simpleIconColor,
      license: tool.license,
      githubStars: tool.githubStars || 0,
      isOpenSource: tool.isOpenSource,
      category: tool.category ? {
        id: tool.category.id,
        name: tool.category.name,
        slug: tool.category.slug,
        color: tool.category.color
      } : undefined,
      features: tool.features.map((tf: any) => ({
        id: tf.id,
        tool: {
          id: tool.id,
          name: tool.name,
          repositoryUrl: tool.repositoryUrl
        },
        feature: {
          id: tf.feature.id,
          name: tf.feature.name,
          slug: tf.feature.slug,
          description: tf.feature.description || '',
          featureType: tf.feature.featureType
        },
        implementationNotes: tf.implementationNotes,
        qualityScore: tf.qualityScore,
        verified: tf.verified || false
      }))
    }))

    return {
      success: true,
      data: tools
    }

  } catch (error) {
    console.error('Error fetching MIT tools:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Get available categories for filtering tools
 */
export async function getToolCategories() {
  const query = `
    query GetToolCategories {
      categories {
        id
        name
        slug
        color
        tools {
          id
        }
      }
    }
  `

  try {
    const response = await keystoneClient(query)

    if (!response.success) {
      return { success: false, data: [], error: response.error }
    }

    // Only return categories that have MIT tools
    const categoriesWithTools = response.data.categories
      .filter((cat: any) => cat.tools.length > 0)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        toolCount: cat.tools.length
      }))
      .sort((a: any, b: any) => b.toolCount - a.toolCount)

    return {
      success: true,
      data: categoriesWithTools
    }

  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}