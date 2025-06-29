import { gql } from 'graphql-request'

export const MULTI_MODEL_SEARCH = gql`
  query MultiModelSearch($search: String!) {
    tools(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      isOpenSource
      simpleIconSlug
      simpleIconColor
    }
    
    features(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      featureType
    }
    
    alternatives(
      where: {
        OR: [
          { comparisonNotes: { contains: $search, mode: insensitive } }
          { proprietaryTool: { 
            OR: [
              { name: { contains: $search, mode: insensitive } }
              { slug: { contains: $search, mode: insensitive } }
            ]
          }}
          { openSourceTool: { 
            OR: [
              { name: { contains: $search, mode: insensitive } }
              { slug: { contains: $search, mode: insensitive } }
            ]
          }}
        ]
      }
      take: 5
      orderBy: { similarityScore: desc }
    ) {
      id
      comparisonNotes
      similarityScore
      proprietaryTool {
        id
        name
        slug
        simpleIconSlug
        simpleIconColor
        websiteUrl
      }
      openSourceTool {
        id
        name
        slug
        description
        simpleIconSlug
        simpleIconColor
        websiteUrl
        repositoryUrl
      }
    }
  }
`

export interface SearchResult {
  tools: {
    id: string
    name: string
    slug: string
    description?: string
    isOpenSource: boolean
    simpleIconSlug?: string
    simpleIconColor?: string
  }[]
  features: {
    id: string
    name: string
    slug: string
    description?: string
    featureType?: string
  }[]
  alternatives: {
    id: string
    comparisonNotes?: string
    similarityScore?: number
    proprietaryTool: {
      id: string
      name: string
      slug: string
      simpleIconSlug?: string
      simpleIconColor?: string
      websiteUrl?: string
    } | null
    openSourceTool: {
      id: string
      name: string
      slug: string
      description?: string
      simpleIconSlug?: string
      simpleIconColor?: string
      websiteUrl?: string
      repositoryUrl?: string
    } | null
  }[]
}