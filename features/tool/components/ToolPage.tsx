import { DisplayCard } from '@/features/landing/components/display-card'
import { Badge } from '@/components/ui/badge'
import FeatureBadge from '@/features/landing/components/FeatureBadge'
import { fetchAlternativesServer, type FilterOptions } from '@/features/landing/actions/getAlternatives'
import { getProprietaryTools } from '@/features/landing/actions/getProprietaryTools'
import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'
import { ExternalLink, Github, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ToolSelector from './ToolSelector'

interface ToolPageProps {
  tool: any
}

async function getToolAlternativeInfo(toolId: string) {
  const query = `
    query GetToolAlternativeInfo($toolId: ID!) {
      # Get what proprietary tools this open source tool is an alternative to
      alternatives(where: { openSourceTool: { id: { equals: $toolId } } }) {
        id
        similarityScore
        proprietaryTool {
          id
          name
          slug
          description
          simpleIconSlug
          simpleIconColor
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
      
      # Get other open source tools in the same category
      tool: tools(where: { id: { equals: $toolId } }) {
        category {
          id
          name
          tools(where: { 
            AND: [
              { isOpenSource: { equals: true } }
              { id: { not: { equals: $toolId } } }
            ]
          }) {
            id
            name
            slug
            description
            websiteUrl
            repositoryUrl
            githubStars
            license
            simpleIconSlug
            simpleIconColor
          }
        }
      }
    }
  `

  const response = await keystoneClient(query, { toolId })
  
  if (!response.success) {
    return { alternatives: [], similarTools: [] }
  }

  return {
    alternatives: response.data.alternatives || [],
    similarTools: response.data.tool?.[0]?.category?.tools || []
  }
}

export default async function ToolPage({ tool }: ToolPageProps) {
  // Handle different logic based on tool type
  if (tool.isOpenSource) {
    // For open source tools, show what they're alternatives to
    const { alternatives, similarTools } = await getToolAlternativeInfo(tool.id)
    return renderOpenSourceToolPage(tool, alternatives, similarTools)
  } else {
    // For proprietary tools, show alternatives to them
    const searchParams = {
      '!proprietaryTool_slug': tool.slug
    }
    
    const [response, allProprietaryTools] = await Promise.all([
      fetchAlternativesServer(searchParams),
      getProprietaryTools()
    ])
    
    return renderProprietaryToolPage(tool, response, allProprietaryTools)
  }
}

function renderOpenSourceToolPage(tool: any, alternatives: any[], similarTools: any[]) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-10">
        <div className="py-8 md:py-16">
          <div className="space-y-8">
            {/* Tool Header */}
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 flex items-center justify-center bg-card rounded-lg border">
                  {tool.simpleIconSlug ? (
                    <div 
                      className="w-10 h-10"
                      style={{ 
                        backgroundColor: tool.simpleIconColor || '#6B7280',
                        mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${tool.simpleIconSlug}.svg) no-repeat center`,
                        WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${tool.simpleIconSlug}.svg) no-repeat center`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                      }}
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: tool.simpleIconColor || '#6B7280' }}
                    >
                      {tool.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-foreground tracking-tight mb-4">
                    {tool.name}
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    {tool.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Badge variant="secondary" className="text-sm">
                      Open Source
                    </Badge>
                    
                    {tool.category && (
                      <Badge variant="outline" className="text-sm">
                        {tool.category.name}
                      </Badge>
                    )}
                    
                    {tool.license && (
                      <Badge variant="outline" className="text-sm">
                        {tool.license}
                      </Badge>
                    )}
                    
                    {tool.githubStars && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        {tool.githubStars.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {tool.websiteUrl && (
                      <Button asChild>
                        <Link href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Website
                        </Link>
                      </Button>
                    )}
                    
                    {tool.repositoryUrl && (
                      <Button asChild variant="outline">
                        <Link href={tool.repositoryUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Repository
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative To Section */}
            {alternatives.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Alternative to</h2>
                <p className="text-muted-foreground">
                  {tool.name} is an open source alternative to these proprietary tools:
                </p>
                <div className="grid gap-4">
                  {alternatives.map((alt: any) => (
                    <Link 
                      key={alt.id} 
                      href={`/tool/${alt.proprietaryTool.slug}`}
                      className="block"
                    >
                      <div className="p-6 bg-card border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg">
                            {alt.proprietaryTool.simpleIconSlug ? (
                              <div 
                                className="w-8 h-8"
                                style={{ 
                                  backgroundColor: alt.proprietaryTool.simpleIconColor || '#6B7280',
                                  mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${alt.proprietaryTool.simpleIconSlug}.svg) no-repeat center`,
                                  WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${alt.proprietaryTool.simpleIconSlug}.svg) no-repeat center`,
                                  maskSize: 'contain',
                                  WebkitMaskSize: 'contain'
                                }}
                              />
                            ) : (
                              <div 
                                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-semibold"
                                style={{ backgroundColor: alt.proprietaryTool.simpleIconColor || '#6B7280' }}
                              >
                                {alt.proprietaryTool.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">
                              {alt.proprietaryTool.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {alt.proprietaryTool.description}
                            </p>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {alt.similarityScore}% similar
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Tools Section */}
            {similarTools.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Similar Open Source Tools</h2>
                <p className="text-muted-foreground">
                  Other open source {tool.category?.name?.toLowerCase()} tools you might be interested in:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {similarTools.slice(0, 6).map((similarTool: any) => (
                    <Link 
                      key={similarTool.id} 
                      href={`/tool/${similarTool.slug}`}
                      className="block"
                    >
                      <div className="p-4 bg-card border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg">
                            {similarTool.simpleIconSlug ? (
                              <div 
                                className="w-6 h-6"
                                style={{ 
                                  backgroundColor: similarTool.simpleIconColor || '#6B7280',
                                  mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${similarTool.simpleIconSlug}.svg) no-repeat center`,
                                  WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${similarTool.simpleIconSlug}.svg) no-repeat center`,
                                  maskSize: 'contain',
                                  WebkitMaskSize: 'contain'
                                }}
                              />
                            ) : (
                              <div 
                                className="w-6 h-6 rounded-md flex items-center justify-center text-white font-semibold text-xs"
                                style={{ backgroundColor: similarTool.simpleIconColor || '#6B7280' }}
                              >
                                {similarTool.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {similarTool.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {similarTool.description}
                            </p>
                            {similarTool.githubStars && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Star className="h-3 w-3" />
                                {similarTool.githubStars.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section */}
            {tool.features && tool.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((toolFeature: any) => (
                    <Badge key={toolFeature.feature.id} variant="outline">
                      {toolFeature.feature.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function renderProprietaryToolPage(tool: any, response: any, allProprietaryTools: any[]) {
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