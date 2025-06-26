import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { osbClient } from '@/features/landing/lib/osbClient'
import ToolDetailPage from './ToolDetailPage'

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

async function getToolBySlug(slug: string) {
  const query = `
    query GetToolBySlug($slug: String!) {
      tool: tools(where: { slug: { equals: $slug } }, take: 1) {
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
        createdAt
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
        }
        proprietaryAlternatives {
          proprietaryTool {
            id
            name
            slug
            description
            logoUrl
            logoSvg
            websiteUrl
          }
        }
        openSourceAlternatives {
          openSourceTool {
            id
            name
            slug
            description
            logoUrl
            logoSvg
            websiteUrl
            repositoryUrl
            githubStars
            license
          }
        }
        techStacks {
          techStack {
            id
            name
            type
            color
            iconUrl
          }
        }
        deploymentOptions {
          id
          platform
          deployUrl
          templateUrl
          difficulty
          estimatedTime
          requirements
          isVerified
        }
      }
    }
  `

  const response = await osbClient(query, { slug })
  
  if (!response.success || !response.data.tool || response.data.tool.length === 0) {
    return null
  }

  return response.data.tool[0]
}

export async function generateStaticParams() {
  const query = `
    query GetAllToolSlugs {
      tools {
        slug
      }
    }
  `

  const response = await osbClient(query)
  
  if (!response.success) {
    return []
  }

  return response.data.tools.map((tool: any) => ({
    slug: tool.slug
  }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    return {
      title: 'Tool Not Found'
    }
  }

  return {
    title: `${tool.name} - Open Source Software Directory`,
    description: tool.description || `Learn about ${tool.name}, an open source tool in the ${tool.category?.name} category.`,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
    }
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  return <ToolDetailPage tool={tool} />
}