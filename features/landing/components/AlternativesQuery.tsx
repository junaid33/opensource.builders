import { DisplayCard } from '@/components/ui/display-card'
import { osbClient } from '../lib/osbClient'
import { TooltipProvider } from '@/components/ui/tooltip'

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
      
      # Get alternatives
      alternatives: tools(where: { 
        isOpenSource: { equals: true }
        openSourceAlternatives: { 
          some: { 
            proprietaryTool: { 
              name: { equals: $proprietaryTool } 
            } 
          } 
        } 
      }) {
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
        proprietaryAlternatives {
          proprietaryTool {
            name
          }
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

  // Create resolved logo for each alternative
  const alternativesWithLogos = alternatives.map((alt: any) => ({
    ...alt,
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
    totalProprietaryFeatures: proprietaryFeatures.length
  }))

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
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {selectedSoftware.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedSoftware}</h3>
                  <p className="text-sm text-gray-600">
                    {proprietaryFeatures.length} features • Showing alternatives below
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {alternatives.length} alternatives found with feature compatibility scores
          </p>
        </div>
        
        <div className="grid gap-4">
          {alternativesWithLogos.map((alternative: any) => (
            <DisplayCard 
              key={alternative.id}
              title={alternative.name}
              description={alternative.description}
              websiteUrl={alternative.websiteUrl}
              repositoryUrl={alternative.repositoryUrl}
              starCount={alternative.githubStars}
              license={alternative.license}
              logoSvg={alternative.logoSvg}
              featuresCount={alternative.features.length}
              totalFeatures={alternative.totalProprietaryFeatures}
              compatibilityScore={alternative.totalProprietaryFeatures > 0 ? Math.round((alternative.features.length / alternative.totalProprietaryFeatures) * 100) : 0}
              missingFeatures={alternative.totalProprietaryFeatures - alternative.features.length}
              features={alternative.features.map((f: any) => ({
                name: f.feature.name,
                featureType: f.feature.featureType
              }))}
              alternatives={alternative.proprietaryAlternatives?.map((alt: any) => ({
                name: alt.proprietaryTool.name,
                icon: undefined
              })) || []}
              toolSlug={alternative.slug}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}