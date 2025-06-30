import Link from 'next/link'
import { Star, ExternalLink, ArrowLeft, GitBranch, AlertCircle, Calendar } from 'lucide-react'
import ToolIcon from '@/components/ToolIcon'
import { DonutChart } from '@/components/ui/donut-chart'

interface Feature {
  id: string
  name: string
  slug: string
  description: string
  featureType: string
}

interface ToolFeature {
  feature: Feature
  implementationNotes?: string
  qualityScore?: number
}

interface Alternative {
  proprietaryTool?: {
    id: string
    name: string
    slug: string
    simpleIconSlug?: string
    simpleIconColor?: string
  }
  openSourceTool?: {
    id: string
    name: string
    slug: string
    simpleIconSlug?: string
    simpleIconColor?: string
  }
  similarityScore?: number
  notes?: string
}

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  websiteUrl?: string
  repositoryUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  license?: string
  githubStars?: number
  githubForks?: number
  githubIssues?: number
  githubLastCommit?: string
  isOpenSource: boolean
  status?: string
  pricingModel?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  features?: ToolFeature[]
  proprietaryAlternatives?: Alternative[]
  openSourceAlternatives?: Alternative[]
}

interface ToolPageProps {
  tool: Tool
}

export default function ToolPage({ tool }: ToolPageProps) {
  const features = tool.features || []
  const alternatives = tool.isOpenSource ? tool.proprietaryAlternatives : tool.openSourceAlternatives
  const alternativeType = tool.isOpenSource ? 'proprietary' : 'open source'

  // Calculate average quality score for features
  const qualityScores = features.filter(f => f.qualityScore).map(f => f.qualityScore!)
  const averageQuality = qualityScores.length > 0 ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to directory
        </Link>

        {/* Main Tool Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Tool Icon */}
            <div className="shrink-0">
              <ToolIcon 
                name={tool.name}
                simpleIconSlug={tool.simpleIconSlug}
                simpleIconColor={tool.simpleIconColor}
                size={80}
                className="rounded-xl border border-gray-200"
              />
            </div>

            {/* Tool Details */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {tool.name}
                    </h1>
                    {tool.isOpenSource && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Open Source
                      </span>
                    )}
                    {tool.license && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {tool.license}
                      </span>
                    )}
                  </div>
                  
                  {/* Category */}
                  {tool.category && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <span className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></span>
                      <span className="text-sm font-medium">{tool.category.name}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {tool.websiteUrl && (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                  {tool.repositoryUrl && (
                    <a
                      href={tool.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {tool.isOpenSource ? 'GitHub' : 'Repository'}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {tool.description}
              </p>

              {/* GitHub Stats */}
              {tool.isOpenSource && tool.repositoryUrl && (
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  {tool.githubStars && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="font-medium">{tool.githubStars.toLocaleString()}</span>
                      <span className="ml-1">stars</span>
                    </div>
                  )}
                  {tool.githubForks && (
                    <div className="flex items-center">
                      <GitBranch className="w-4 h-4 mr-1" />
                      <span className="font-medium">{tool.githubForks.toLocaleString()}</span>
                      <span className="ml-1">forks</span>
                    </div>
                  )}
                  {tool.githubIssues && (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="font-medium">{tool.githubIssues.toLocaleString()}</span>
                      <span className="ml-1">issues</span>
                    </div>
                  )}
                  {tool.githubLastCommit && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Updated {new Date(tool.githubLastCommit).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {tool.status && (
                  <div>
                    <span className="font-medium">Status:</span> {tool.status}
                  </div>
                )}
                {tool.pricingModel && (
                  <div>
                    <span className="font-medium">Pricing:</span> {tool.pricingModel}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {features.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Features & Capabilities</h2>
              {averageQuality > 0 && (
                <div className="flex items-center gap-3">
                  <DonutChart 
                    value={averageQuality} 
                    total={10}
                    size={50}
                    strokeWidth={5}
                  />
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">Quality Score</div>
                    <div className="text-gray-500">{averageQuality}/10 average</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((toolFeature) => (
                <div key={toolFeature.feature.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{toolFeature.feature.name}</h3>
                    {toolFeature.qualityScore && (
                      <span className="text-sm font-medium text-green-600">
                        {toolFeature.qualityScore}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{toolFeature.feature.description}</p>
                  {toolFeature.feature.featureType && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                      {toolFeature.feature.featureType}
                    </span>
                  )}
                  {toolFeature.implementationNotes && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {toolFeature.implementationNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives Section */}
        {alternatives && alternatives.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {tool.isOpenSource ? 'Proprietary Alternatives' : 'Open Source Alternatives'}
            </h2>
            
            <div className="space-y-4">
              {alternatives.map((alt, index) => {
                const altTool = tool.isOpenSource ? alt.proprietaryTool : alt.openSourceTool
                if (!altTool) return null

                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <ToolIcon 
                      name={altTool.name}
                      simpleIconSlug={altTool.simpleIconSlug}
                      simpleIconColor={altTool.simpleIconColor}
                      size={48}
                      className="rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{altTool.name}</h3>
                        {alt.similarityScore && (
                          <span className="text-sm font-medium text-blue-600">
                            {alt.similarityScore}% match
                          </span>
                        )}
                      </div>
                      {alt.notes && (
                        <p className="text-sm text-gray-600">{alt.notes}</p>
                      )}
                    </div>
                    <Link
                      href={`/tool/${altTool.slug}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}