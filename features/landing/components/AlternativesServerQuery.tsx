/**
 * Server component that fetches alternatives data
 */

import { DisplayCard } from './display-card'
import { Badge } from '@/components/ui/badge'
import FeatureBadge from './FeatureBadge'
import { fetchAlternativesServer, type FilterOptions } from '../actions/getAlternatives'

interface AlternativesServerQueryProps {
  selectedSoftware: string
  filters?: FilterOptions
}

export default async function AlternativesServerQuery({ selectedSoftware, filters = {} }: AlternativesServerQueryProps) {
  const response = await fetchAlternativesServer(selectedSoftware, filters)
  
  if (!response.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load alternatives: {response.error}</p>
      </div>
    )
  }

  const data = response.data
  const proprietaryFeatures = data.proprietaryTool?.[0]?.features || []
  const alternatives = data.alternatives || []

  // Create resolved logo and feature compatibility for each alternative
  const alternativesWithLogos = alternatives.map((altRelation: any) => {
    const alt = altRelation.openSourceTool
    if (!alt) return null

    // Map proprietary features to check compatibility
    const proprietaryFeatureIds = new Set(proprietaryFeatures.map((f: any) => f.feature.id))
    const alternativeFeatureIds = new Set(alt.features?.map((f: any) => f.feature.id) || [])
    
    // Create features array with compatibility information
    const featuresWithCompatibility = proprietaryFeatures.map((propFeature: any) => ({
      name: propFeature.feature.name,
      compatible: alternativeFeatureIds.has(propFeature.feature.id),
      featureType: propFeature.feature.featureType
    }))

    const compatibilityScore = proprietaryFeatures.length > 0 
      ? Math.round(((alt.features?.length || 0) / proprietaryFeatures.length) * 100) 
      : 0

    return {
      ...alt,
      id: altRelation.id,
      similarityScore: altRelation.similarityScore,
      totalProprietaryFeatures: proprietaryFeatures.length,
      featuresWithCompatibility,
      compatibilityScore
    }
  }).filter(Boolean)

  if (alternatives.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No open source alternatives found for {selectedSoftware}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Open Source Alternatives to {selectedSoftware}
        </h2>
        <p className="text-gray-600 mb-6">
          {alternatives.length} alternatives found with feature compatibility scores
        </p>
      </div>
      
      <div className="grid gap-6">
        {alternativesWithLogos.map((alternative: any) => (
          <DisplayCard 
            key={alternative.id}
            name={alternative.name}
            description={alternative.description}
            license={alternative.license}
            isOpenSource={alternative.isOpenSource}
            githubStars={alternative.githubStars}
            features={alternative.featuresWithCompatibility}
            repositoryUrl={alternative.repositoryUrl}
            websiteUrl={alternative.websiteUrl}
            logoSvg={alternative.logoSvg}
            totalFeatures={alternative.totalProprietaryFeatures}
            compatibilityScore={alternative.compatibilityScore}
            alternatives={[{ name: selectedSoftware }]}
          />
        ))}
      </div>
    </div>
  )
}