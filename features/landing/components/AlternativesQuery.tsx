import { DisplayCard } from '@/features/landing/components/display-card'
import { osbClient } from '../lib/osbClient'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface AlternativesQueryProps {
  selectedSoftware?: string
}

async function fetchAlternatives(proprietaryTool: string) {
  const query = `
    query GetAlternatives($proprietaryTool: String!) {
      # Get the proprietary tool and its features
      proprietaryTool: tools(where: { name: { equals: $proprietaryTool } }) {
        id
        name
        features {
          feature {
            id
            name
            slug
            description
            featureType
          }
        }
      }
      
      # Get alternatives using the Alternative relationship
      alternatives(where: { 
        proprietaryTool: { 
          name: { equals: $proprietaryTool } 
        } 
      }) {
        id
        similarityScore
        openSourceTool {
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
          category {
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
        }
      }
    }
  `;

  const response = await osbClient(query, { proprietaryTool });
  
  if (!response.success) {
    console.error('Failed to fetch alternatives:', response.error);
    return { proprietaryTool: [], alternatives: [] };
  }

  return response.data;
}

export default async function AlternativesQuery({ selectedSoftware = 'Shopify' }: AlternativesQueryProps) {
  const data = await fetchAlternatives(selectedSoftware)
  
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
      resolvedLogo: alt.logoSvg ? {
        type: 'svg' as const,
        data: alt.logoSvg,
        verified: true
      } : alt.logoUrl ? {
        type: 'url' as const,
        data: alt.logoUrl,
        verified: true
      } : {
        type: 'letter' as const,
        data: alt.name.charAt(0),
        svg: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#3B82F6"/>
                <text x="28" y="28" dy="0.35em" text-anchor="middle" 
                      fill="white" font-family="system-ui, sans-serif" 
                      font-size="28" font-weight="600">${alt.name.charAt(0)}</text>
              </svg>`,
        verified: true
      },
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
    <TooltipProvider delayDuration={0}>
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Open Source Alternatives
          </h2>
          
          {/* Selected Software Display */}
          {data.proprietaryTool?.[0] && (
            <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {selectedSoftware.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{selectedSoftware}</h3>
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-orange-500"
                          aria-hidden="true"
                        />
                        Proprietary
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {proprietaryFeatures.length} features analyzed • Finding open source alternatives
                    </p>
                  </div>
                </div>
                                 <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                   <div className="flex items-center gap-1">
                     <div className="w-2 h-2 bg-primary rounded-full"></div>
                     <span>Reference Tool</span>
                   </div>
                 </div>
              </div>
            </div>
          )}
          
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
              toolSlug={alternative.slug}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}