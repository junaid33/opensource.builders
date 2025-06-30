'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

export async function getToolBySlug(slug: string) {
  const query = `
    query GetToolBySlug($slug: String!) {
      tools(where: { slug: { equals: $slug } }) {
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
        githubForks
        githubIssues
        githubLastCommit
        isOpenSource
        status
        pricingModel
        category {
          id
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
          implementationNotes
          qualityScore
        }
        proprietaryAlternatives {
          proprietaryTool {
            id
            name
            slug
            simpleIconSlug
            simpleIconColor
          }
          similarityScore
          notes
        }
        openSourceAlternatives {
          openSourceTool {
            id
            name
            slug
            simpleIconSlug
            simpleIconColor
          }
          similarityScore
          notes
        }
      }
    }
  `

  const response = await keystoneClient(query, { slug })
  
  if (!response.success) {
    console.error('Failed to fetch tool:', response.error)
    return {
      success: false,
      error: response.error,
      data: null
    }
  }

  const tool = response.data.tools?.[0]
  
  if (!tool) {
    return {
      success: false,
      error: 'Tool not found',
      data: null
    }
  }

  return {
    success: true,
    data: tool
  }
}