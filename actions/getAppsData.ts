'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

export async function getAppsData() {
  const query = `
    query GetAllOpenSourceApps {
      openSourceApplications(
        orderBy: { name: asc }
      ) {
        id
        name
        slug
        description
        repositoryUrl
        websiteUrl
        simpleIconSlug
        simpleIconColor
        capabilities {
          capability {
            id
            name
            slug
            description
            category
            complexity
          }
          implementationNotes
          githubPath
          documentationUrl
          implementationComplexity
          isActive
        }
      }
    }
  `

  try {
    const response = await keystoneClient(query)

    if (!response.success) {
      console.error('Failed to fetch apps:', response.error)
      return {
        success: false,
        error: response.error
      }
    }

    return {
      success: true,
      data: response.data.openSourceApplications
    }

  } catch (error) {
    console.error('Error fetching apps:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}