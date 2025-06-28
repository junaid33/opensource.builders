'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'
import type { Tool } from '../types/build'

interface GetMitToolsServerResponse {
  success: boolean
  data: Tool[]
  error?: string
}

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  toolCount: number
}

/**
 * Server-side action to fetch MIT-licensed open source tools
 */
export async function getMitToolsServer(): Promise<GetMitToolsServerResponse> {
  const query = `
    query GetMitTools {
      tools(
        where: { 
          AND: [
            { isOpenSource: { equals: true } }
            { license: { equals: "MIT" } }
          ]
        }
        orderBy: [{ githubStars: desc }]
      ) {
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
    const response = await keystoneClient(query)

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
      features: tool.features
        .filter((tf: any) => tf.feature !== null) // Filter out null features
        .map((tf: any) => ({
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
 * Server-side action to get available categories for MIT tools
 */
export async function getToolCategoriesServer(): Promise<{ success: boolean; data: Category[]; error?: string }> {
  const query = `
    query GetToolCategories {
      categories {
        id
        name
        slug
        color
        tools(where: { 
          AND: [
            { isOpenSource: { equals: true } }
            { license: { equals: "MIT" } }
          ]
        }) {
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