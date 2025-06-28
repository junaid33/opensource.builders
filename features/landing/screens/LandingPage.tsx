import { Suspense } from 'react'
import { LandingPageClient } from './LandingPageClient'
import AlternativesServerQuery from '../components/AlternativesServerQuery'
import FilterSidebar from '../components/FilterSidebar'
import { fetchCategoriesServer, fetchFeaturesServer } from '../actions/getAlternatives'
import { getProprietaryTools } from '../actions/getProprietaryTools'

interface LandingPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function AlternativesLoading() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-gray-200 pb-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export async function LandingPage({ searchParams }: LandingPageProps) {
  const resolvedSearchParams = await searchParams || {}
  const selectedSoftware = resolvedSearchParams.software?.toString() || 'Shopify'

  // Fetch categories, features, and proprietary tools for the sidebar
  const categoriesResponse = await fetchCategoriesServer()
  const featuresResponse = await fetchFeaturesServer()
  const availableCategories = categoriesResponse.success ? categoriesResponse.data : []
  const availableFeatures = featuresResponse.success ? featuresResponse.data : []
  const proprietaryTools = await getProprietaryTools()

  // Create a unique key for Suspense to trigger re-renders based on all search params
  const suspenseKey = `${selectedSoftware}-${JSON.stringify(resolvedSearchParams)}`

  return (
    <LandingPageClient 
      initialSelectedSoftware={selectedSoftware}
      proprietaryTools={proprietaryTools}
      sidebarSlot={
        <FilterSidebar 
          availableCategories={availableCategories}
          availableFeatures={availableFeatures}
          selectedSoftware={selectedSoftware}
          proprietaryTools={proprietaryTools}
        />
      }
      alternativesSlot={
        <div className="pb-8 md:pb-16" id="alternatives">
          <Suspense fallback={<AlternativesLoading />} key={suspenseKey}>
            <AlternativesServerQuery searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      }
    />
  )
}