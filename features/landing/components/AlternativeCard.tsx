import Link from 'next/link'
import { Star, ExternalLink } from 'lucide-react'
import ToolLogo from './ToolLogo'
import { DonutChart } from '@/components/ui/donut-chart'

interface ResolvedLogo {
  type: 'svg' | 'url' | 'favicon' | 'letter'
  data: string
  domain?: string
  verified?: boolean
  svg?: string
}

interface Feature {
  id: string
  name: string
  slug: string
  description: string
  featureType: string
}

interface AlternativeCardProps {
  id: string
  name: string
  description: string
  websiteUrl?: string
  repositoryUrl?: string
  logoUrl?: string
  resolvedLogo?: ResolvedLogo
  license?: string
  githubStars?: number
  category?: {
    name: string
    slug: string
  }
  isOpenSource: boolean
  proprietaryAlternatives?: Array<{
    proprietaryTool: {
      name: string
    }
  }>
  features?: Array<{
    feature: Feature
  }>
  totalProprietaryFeatures?: number
}

export default function AlternativeCard({
  id,
  name,
  description,
  websiteUrl,
  repositoryUrl,
  logoUrl,
  resolvedLogo,
  license,
  githubStars,
  category,
  isOpenSource,
  proprietaryAlternatives,
  features = [],
  totalProprietaryFeatures = 0
}: AlternativeCardProps) {
  const matchingFeatures = features.length
  const compatibilityScore = totalProprietaryFeatures > 0 ? Math.round((matchingFeatures / totalProprietaryFeatures) * 100) : 0
  return (
    <div className="group border-b border-gray-200 pb-6">
      <div className="flex items-start space-x-4">
        {/* Logo */}
        <div className="shrink-0">
          <ToolLogo 
            name={name}
            resolvedLogo={resolvedLogo}
            size={56}
            className="rounded-lg border border-gray-200"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {name}
                </h3>
                {isOpenSource && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Open Source
                  </span>
                )}
                {license && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {license}
                  </span>
                )}
              </div>

              {/* Alternative to */}
              {proprietaryAlternatives && proprietaryAlternatives.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">
                    Alternative to: {' '}
                    <span className="font-medium text-gray-700">
                      {proprietaryAlternatives.map(alt => alt.proprietaryTool.name).join(', ')}
                    </span>
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {description}
              </p>

              {/* Feature Compatibility */}
              {totalProprietaryFeatures > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Feature Compatibility</span>
                    <span className="text-sm text-gray-500">{compatibilityScore}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DonutChart 
                      value={matchingFeatures} 
                      total={totalProprietaryFeatures}
                      size={40}
                      strokeWidth={4}
                    />
                    <div className="text-xs text-gray-600">
                      <div className="font-medium">{matchingFeatures} of {totalProprietaryFeatures} features</div>
                      {matchingFeatures < totalProprietaryFeatures && (
                        <div className="text-gray-500 mt-1">
                          Missing: {totalProprietaryFeatures - matchingFeatures} features
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {category && (
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-1"></span>
                    {category.name}
                  </span>
                )}
                {githubStars && (
                  <span className="inline-flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {githubStars.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {repositoryUrl && (
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 transition-colors"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}