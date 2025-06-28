import { LandingPageClient } from './LandingPageClient'
import AlternativesServerQuery from '../components/AlternativesServerQuery'
import FilterSidebar from '../components/FilterSidebar'
import { fetchCategoriesServer, fetchFeaturesServer } from '../actions/getAlternatives'
import { getProprietaryTools } from '../actions/getProprietaryTools'

interface LandingPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function LandingPage({ searchParams }: LandingPageProps) {
  const resolvedSearchParams = await searchParams || {}
  
  // Extract selected software from proprietaryTool filter in URL params
  let selectedSoftware = 'Shopify' // default
  
  // Check for proprietaryTool filter in URL
  const proprietaryToolFilter = Object.keys(resolvedSearchParams).find(key => key.startsWith('!proprietaryTool_'))
  if (proprietaryToolFilter) {
    try {
      const filterValue = resolvedSearchParams[proprietaryToolFilter]?.toString()
      if (filterValue) {
        // Get proprietaryTools to map ID to name
        const proprietaryTools = await getProprietaryTools()
        const toolId = JSON.parse(filterValue)
        const selectedTool = proprietaryTools.find(tool => tool.id === toolId)
        if (selectedTool) {
          selectedSoftware = selectedTool.name
        }
      }
    } catch (e) {
      // If parsing fails, keep default
    }
  }
  
  // Fetch proprietaryTools again for the sidebar (we need it earlier now)
  const proprietaryTools = await getProprietaryTools()

  // Fetch categories and features for the sidebar
  const categoriesResponse = await fetchCategoriesServer()
  const featuresResponse = await fetchFeaturesServer()
  const availableCategories = categoriesResponse.success ? categoriesResponse.data : []
  const availableFeatures = featuresResponse.success ? featuresResponse.data : []

  // Create a unique key for Suspense to trigger re-renders based on all search params
  const suspenseKey = `${selectedSoftware}-${JSON.stringify(resolvedSearchParams)}`

  return (
    <LandingPageClient 
      initialSelectedSoftware={selectedSoftware}
      proprietaryTools={proprietaryTools}
      sidebarSlot={
        <FilterSidebar 
          key={`sidebar-${suspenseKey}`}
          availableCategories={availableCategories}
          availableFeatures={availableFeatures}
          selectedSoftware={selectedSoftware}
          proprietaryTools={proprietaryTools}
        />
      }
      alternativesSlot={
        <div className="pb-8 md:pb-16" id="alternatives">
          <AlternativesServerQuery searchParams={resolvedSearchParams} />
        </div>
      }
    />
  )
}