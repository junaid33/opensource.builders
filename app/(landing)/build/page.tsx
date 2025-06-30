import { BuildPage } from '@/features/build/screens/BuildPage'
import { getMitToolsServer, getToolCategoriesServer } from '@/features/build/actions/getMitToolsServer'

export const metadata = {
  title: 'Build Your Project - Open Source Builders',
  description: 'Select features from proven open source tools and get AI-powered implementation guidance for your Next.js/Keystone project.'
}

export default async function Build() {
  // Fetch MIT tools and categories server-side
  const [toolsResponse, categoriesResponse] = await Promise.all([
    getMitToolsServer(),
    getToolCategoriesServer()
  ])

  const tools = toolsResponse.success ? toolsResponse.data : []
  const categories = categoriesResponse.success ? categoriesResponse.data : []

  return (
    <BuildPage 
      initialTools={tools} 
      initialCategories={categories}
    />
  )
}