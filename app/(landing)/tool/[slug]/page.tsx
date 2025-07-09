import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/features/landing/actions/getTool'
import ToolPage from '@/features/tool/components/ToolPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ToolPageRoute({ params }: PageProps) {
  const { slug } = await params
  
  const result = await getToolBySlug(slug)
  
  if (!result.success || !result.data) {
    notFound()
  }

  return <ToolPage tool={result.data} />
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const result = await getToolBySlug(slug)

  if (!result.success || !result.data) {
    return {
      title: 'Tool Not Found - Open Source Builders',
    }
  }

  const tool = result.data
  
  if (tool.isOpenSource) {
    return {
      title: `${tool.name} - Open Source ${tool.category?.name || 'Tool'}`,
      description: `${tool.description} - Find what ${tool.name} is an alternative to and discover similar open source tools.`,
    }
  } else {
    return {
      title: `${tool.name} - Open Source ${tool.category?.name || 'Tool'} Alternative`,
      description: `Find the best open source alternatives to ${tool.name}. ${tool.description}`,
    }
  }
}