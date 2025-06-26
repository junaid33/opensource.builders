import Link from 'next/link'
import { ExternalLink, Star, Code, ArrowRight } from 'lucide-react'
import ToolLogo from '@/features/landing/components/ToolLogo'

interface ProprietaryAlternative {
  proprietaryTool: {
    id: string
    name: string
    slug: string
    description: string
    logoUrl?: string
    logoSvg?: string
    websiteUrl?: string
  }
}

interface OpenSourceAlternative {
  openSourceTool: {
    id: string
    name: string
    slug: string
    description: string
    logoUrl?: string
    logoSvg?: string
    websiteUrl?: string
    repositoryUrl?: string
    githubStars?: number
    license?: string
  }
}

interface AlternativesComparisonProps {
  proprietaryAlternatives: ProprietaryAlternative[]
  openSourceAlternatives: OpenSourceAlternative[]
}

function createResolvedLogo(tool: any) {
  return tool.logoSvg ? {
    type: 'svg' as const,
    data: tool.logoSvg,
    verified: true
  } : tool.logoUrl ? {
    type: 'url' as const,
    data: tool.logoUrl,
    verified: true
  } : {
    type: 'letter' as const,
    data: tool.name.charAt(0),
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#3B82F6"/>
            <text x="24" y="24" dy="0.35em" text-anchor="middle" 
                  fill="white" font-family="system-ui, sans-serif" 
                  font-size="20" font-weight="600">${tool.name.charAt(0)}</text>
          </svg>`,
    verified: true
  }
}

export default function AlternativesComparison({ 
  proprietaryAlternatives, 
  openSourceAlternatives 
}: AlternativesComparisonProps) {
  const hasProprietaryAlternatives = proprietaryAlternatives.length > 0
  const hasOpenSourceAlternatives = openSourceAlternatives.length > 0

  if (!hasProprietaryAlternatives && !hasOpenSourceAlternatives) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Alternatives</h2>
        <p className="text-gray-600">
          Compare similar tools and find the best fit for your needs
        </p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Proprietary Alternatives */}
        {hasProprietaryAlternatives && (
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mr-3">Proprietary Alternatives</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {proprietaryAlternatives.length} tool{proprietaryAlternatives.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {proprietaryAlternatives.map((alt) => {
                const tool = alt.proprietaryTool
                const resolvedLogo = createResolvedLogo(tool)
                
                return (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <ToolLogo 
                        name={tool.name}
                        resolvedLogo={resolvedLogo}
                        size={48}
                        className="rounded-lg border border-gray-200 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                          {tool.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          {tool.websiteUrl && (
                            <a
                              href={tool.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Open Source Alternatives */}
        {hasOpenSourceAlternatives && (
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mr-3">Open Source Alternatives</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Code className="w-3 h-3 mr-1" />
                {openSourceAlternatives.length} tool{openSourceAlternatives.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {openSourceAlternatives.map((alt) => {
                const tool = alt.openSourceTool
                const resolvedLogo = createResolvedLogo(tool)
                
                return (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <ToolLogo 
                        name={tool.name}
                        resolvedLogo={resolvedLogo}
                        size={48}
                        className="rounded-lg border border-gray-200 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {tool.name}
                          </h4>
                          {tool.license && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 shrink-0">
                              {tool.license}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {tool.githubStars && (
                              <span className="inline-flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {tool.githubStars.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {tool.websiteUrl && (
                              <a
                                href={tool.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                Website
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                            {tool.repositoryUrl && (
                              <a
                                href={tool.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs px-2.5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                <Code className="w-3 h-3 mr-1" />
                                Code
                              </a>
                            )}
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="inline-flex items-center text-xs px-2.5 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                            >
                              View Details
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Comparison Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Alternative Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Total alternatives:</strong> {proprietaryAlternatives.length + openSourceAlternatives.length}
            </p>
            {hasProprietaryAlternatives && (
              <p>
                <strong>Proprietary options:</strong> {proprietaryAlternatives.length} 
                {proprietaryAlternatives.length === 1 ? ' tool' : ' tools'}
              </p>
            )}
            {hasOpenSourceAlternatives && (
              <p>
                <strong>Open source options:</strong> {openSourceAlternatives.length} 
                {openSourceAlternatives.length === 1 ? ' tool' : ' tools'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}