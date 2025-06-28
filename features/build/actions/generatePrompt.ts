'use server'

import { generateImplementationPrompt } from '../lib/promptTemplates'
import type { Tool, SelectedFeature, GeneratedPrompt } from '../types/build'

interface GeneratePromptResponse {
  success: boolean
  data?: GeneratedPrompt
  error?: string
}

/**
 * Generate a comprehensive AI implementation prompt based on selected tools and features
 */
export async function generatePrompt(
  selectedTools: Tool[],
  selectedFeatures: SelectedFeature[]
): Promise<GeneratePromptResponse> {
  try {
    // Validate inputs
    if (!selectedTools || selectedTools.length === 0) {
      return {
        success: false,
        error: 'No tools selected. Please select at least one tool.'
      }
    }

    if (!selectedFeatures || selectedFeatures.length === 0) {
      return {
        success: false,
        error: 'No features selected. Please select at least one feature.'
      }
    }

    // Validate that all selected features belong to selected tools
    const selectedToolIds = new Set(selectedTools.map(tool => tool.id))
    const invalidFeatures = selectedFeatures.filter(feature => !selectedToolIds.has(feature.toolId))
    
    if (invalidFeatures.length > 0) {
      return {
        success: false,
        error: `Some selected features don't belong to selected tools: ${invalidFeatures.map(f => f.featureName).join(', ')}`
      }
    }

    // Generate the prompt
    const generatedPrompt = generateImplementationPrompt(selectedTools, selectedFeatures)

    return {
      success: true,
      data: generatedPrompt
    }

  } catch (error) {
    console.error('Error generating prompt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate prompt'
    }
  }
}

/**
 * Generate a preview of the prompt for display in the UI
 */
export async function generatePromptPreview(
  selectedTools: Tool[],
  selectedFeatures: SelectedFeature[]
): Promise<GeneratePromptResponse> {
  const result = await generatePrompt(selectedTools, selectedFeatures)
  
  if (!result.success || !result.data) {
    return result
  }

  // Create a shorter version for preview
  const preview = {
    ...result.data,
    fullPrompt: result.data.fullPrompt.substring(0, 1000) + '...\n\n[Preview truncated - full prompt will be longer]'
  }

  return {
    success: true,
    data: preview
  }
}

/**
 * Get prompt statistics for display
 */
export async function getPromptStats(
  selectedTools: Tool[],
  selectedFeatures: SelectedFeature[]
) {
  try {
    const prompt = await generatePrompt(selectedTools, selectedFeatures)
    
    if (!prompt.success || !prompt.data) {
      return { success: false, error: prompt.error }
    }

    const stats = {
      toolCount: selectedTools.length,
      featureCount: selectedFeatures.length,
      estimatedReadTime: Math.ceil(prompt.data.fullPrompt.length / 200), // ~200 chars per minute
      wordCount: prompt.data.fullPrompt.split(/\s+/).length,
      characterCount: prompt.data.fullPrompt.length,
      implementationSteps: prompt.data.implementationPlan.length,
      resourceCount: prompt.data.resources.length
    }

    return {
      success: true,
      data: stats
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate stats'
    }
  }
}