'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'
import type { ToolFeature, FeatureType } from '../types/build'

interface GetToolFeaturesResponse {
  success: boolean
  data: ToolFeature[]
  error?: string
}

/**
 * Get detailed features for selected tools with quality scores
 */
export async function getToolFeatures(toolIds: string[]): Promise<GetToolFeaturesResponse> {
  if (!toolIds || toolIds.length === 0) {
    return {
      success: true,
      data: []
    }
  }

  const query = `
    query GetToolFeatures($toolIds: [ID!]!) {
      toolFeatures(
        where: { 
          tool: { id: { in: $toolIds } }
        }
        orderBy: [
          { verified: desc },
          { qualityScore: desc }
        ]
      ) {
        id
        tool {
          id
          name
          repositoryUrl
        }
        feature {
          id
          name
          slug
          description
          featureType
          category {
            id
            name
          }
        }
        implementationNotes
        qualityScore
        verified
      }
    }
  `

  try {
    const response = await keystoneClient(query, { toolIds })

    if (!response.success) {
      console.error('Failed to fetch tool features:', response.error)
      return {
        success: false,
        data: [],
        error: response.error
      }
    }

    // Transform the response to match our ToolFeature interface
    const toolFeatures: ToolFeature[] = response.data.toolFeatures.map((tf: any) => ({
      id: tf.id,
      tool: {
        id: tf.tool.id,
        name: tf.tool.name,
        repositoryUrl: tf.tool.repositoryUrl
      },
      feature: {
        id: tf.feature.id,
        name: tf.feature.name,
        slug: tf.feature.slug,
        description: tf.feature.description || '',
        featureType: tf.feature.featureType,
        category: tf.feature.category ? {
          id: tf.feature.category.id,
          name: tf.feature.category.name
        } : undefined
      },
      implementationNotes: tf.implementationNotes,
      qualityScore: tf.qualityScore,
      verified: tf.verified || false
    }))

    return {
      success: true,
      data: toolFeatures
    }

  } catch (error) {
    console.error('Error fetching tool features:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Get features grouped by tool for easier organization
 */
export async function getToolFeaturesGrouped(toolIds: string[]) {
  const result = await getToolFeatures(toolIds)
  
  if (!result.success) {
    return result
  }

  // Group features by tool
  const groupedFeatures = result.data.reduce((acc, toolFeature) => {
    const toolId = toolFeature.tool.id
    
    if (!acc[toolId]) {
      acc[toolId] = {
        tool: toolFeature.tool,
        features: []
      }
    }
    
    acc[toolId].features.push(toolFeature)
    
    return acc
  }, {} as Record<string, { tool: ToolFeature['tool'], features: ToolFeature[] }>)

  return {
    success: true,
    data: groupedFeatures
  }
}

/**
 * Get features grouped by feature type for better UX
 */
export async function getToolFeaturesByType(toolIds: string[]) {
  const result = await getToolFeatures(toolIds)
  
  if (!result.success) {
    return result
  }

  // Group features by feature type
  const featuresByType = result.data.reduce((acc, toolFeature) => {
    const featureType = toolFeature.feature.featureType
    
    if (!acc[featureType]) {
      acc[featureType] = []
    }
    
    acc[featureType].push(toolFeature)
    
    return acc
  }, {} as Record<FeatureType, ToolFeature[]>)

  // Sort each type by quality score
  Object.keys(featuresByType).forEach(type => {
    featuresByType[type as FeatureType].sort((a, b) => {
      // Verified features first
      if (a.verified && !b.verified) return -1
      if (!a.verified && b.verified) return 1
      
      // Then by quality score
      const aScore = a.qualityScore || 0
      const bScore = b.qualityScore || 0
      return bScore - aScore
    })
  })

  return {
    success: true,
    data: featuresByType
  }
}

/**
 * Get feature statistics for a set of tools
 */
export async function getToolFeatureStats(toolIds: string[]) {
  const result = await getToolFeatures(toolIds)
  
  if (!result.success) {
    return { success: false, data: null, error: result.error }
  }

  const features = result.data
  const stats = {
    totalFeatures: features.length,
    verifiedFeatures: features.filter(f => f.verified).length,
    averageQuality: features.reduce((sum, f) => sum + (f.qualityScore || 0), 0) / features.length,
    featureTypeBreakdown: {} as Record<FeatureType, number>,
    toolBreakdown: {} as Record<string, number>
  }

  // Calculate feature type breakdown
  features.forEach(feature => {
    const type = feature.feature.featureType
    stats.featureTypeBreakdown[type] = (stats.featureTypeBreakdown[type] || 0) + 1
  })

  // Calculate tool breakdown
  features.forEach(feature => {
    const toolName = feature.tool.name
    stats.toolBreakdown[toolName] = (stats.toolBreakdown[toolName] || 0) + 1
  })

  return {
    success: true,
    data: stats
  }
}