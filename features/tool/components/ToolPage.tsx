import { DisplayCard } from '@/features/landing/components/display-card'
import { Badge } from '@/components/ui/badge'
import FeatureBadge from '@/features/landing/components/FeatureBadge'
import { fetchAlternativesServer, type FilterOptions } from '@/features/landing/actions/getAlternatives'
import { getProprietaryTools } from '@/features/landing/actions/getProprietaryTools'
import ToolSelector from './ToolSelector'

interface ToolPageProps {
  tool: any
}

export default async function ToolPage({ tool }: ToolPageProps) {
  // Use the tool ID from the passed tool prop
  const searchParams = {
    '!proprietaryTool_is': JSON.stringify(tool.id)
  }
  
  const [response, allProprietaryTools] = await Promise.all([
    fetchAlternativesServer(searchParams),
    getProprietaryTools()
  ])
  
  if (!response.success) {
    return (
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-8 md:py-16">
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load alternatives: {response.error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const data = response.data
  const proprietaryTool = data.proprietaryTool?.[0]
  const proprietaryFeatures = proprietaryTool?.features || []
  const alternatives = data.alternatives || []
  const selectedSoftware = proprietaryTool?.name || 'Selected Software'

  // Create feature compatibility for each alternative
  const alternativesWithFeatures = alternatives.map((altRelation: any) => {
    const alt = altRelation.openSourceTool
    if (!alt) return null

    // Map proprietary features to check compatibility
    const alternativeFeatureIds = new Set(alt.features?.map((f: any) => f.feature?.id).filter(Boolean) || [])
    
    // Create features array with compatibility information
    const featuresWithCompatibility = proprietaryFeatures.filter((propFeature: any) => propFeature.feature).map((propFeature: any) => ({
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
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="py-8 md:py-16">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No open source alternatives found for {selectedSoftware}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-10">
        <div className="py-8 md:py-16">
          <div className="space-y-6">
            <div className="mb-8">
              <div className="mb-4">
                <ToolSelector 
                  currentTool={selectedSoftware}
                  allTools={allProprietaryTools}
                />
              </div>
              <p className="text-muted-foreground mb-6 text-2xl tracking-tighter">
                {alternatives.length} alternatives found
              </p>
            </div>
            
            <div className="grid gap-6">
              {alternativesWithFeatures.map((alternative: any) => (
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
                  simpleIconSlug={alternative.simpleIconSlug}
                  simpleIconColor={alternative.simpleIconColor}
                  totalFeatures={alternative.totalProprietaryFeatures}
                  compatibilityScore={alternative.compatibilityScore}
                  alternatives={[{ 
                    name: selectedSoftware,
                    simpleIconSlug: proprietaryTool?.simpleIconSlug,
                    simpleIconColor: proprietaryTool?.simpleIconColor
                  }]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}