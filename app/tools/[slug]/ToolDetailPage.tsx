import Link from 'next/link'
import { ArrowLeft, ExternalLink, Star, Calendar, Shield, Code, Users, Zap } from 'lucide-react'
import ToolLogo from '@/features/landing/components/ToolLogo'
import ToolSidebar from './ToolSidebar'
import FeatureShowcase from './FeatureShowcase'
import AlternativesComparison from './AlternativesComparison'
import TechStackDisplay from './TechStackDisplay'
import DeploymentOptions from './DeploymentOptions'

interface ToolDetailPageProps {
  tool: {
    id: string
    name: string
    slug: string
    description: string
    websiteUrl?: string
    repositoryUrl?: string
    logoUrl?: string
    logoSvg?: string
    license?: string
    githubStars?: number
    isOpenSource: boolean
    createdAt: string
    category?: {
      id: string
      name: string
      slug: string
    }
    features: Array<{
      feature: {
        id: string
        name: string
        slug: string
        description: string
        featureType: string
      }
    }>
    proprietaryAlternatives: Array<{
      proprietaryTool: {
        id: string
        name: string
        slug: string
        description: string
        logoUrl?: string
        logoSvg?: string
        websiteUrl?: string
      }
    }>
    openSourceAlternatives: Array<{
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
    }>
    techStacks: Array<{
      techStack: {
        id: string
        name: string
        slug: string
        description: string
        category: string
      }
    }>
    deploymentOptions: Array<{
      id: string
      platform: string
      deployUrl?: string
      templateUrl?: string
      difficulty?: string
      estimatedTime?: string
      requirements?: any
      isVerified: boolean
    }>
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ToolDetailPage({ tool }: ToolDetailPageProps) {
  const resolvedLogo = tool.logoSvg ? {
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
    svg: `<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="36" fill="#3B82F6"/>
            <text x="36" y="36" dy="0.35em" text-anchor="middle" 
                  fill="white" font-family="system-ui, sans-serif" 
                  font-size="36" font-weight="600">${tool.name.charAt(0)}</text>
          </svg>`,
    verified: true
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-16">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              
              {/* Logo and Basic Info */}
              <div className="flex items-start gap-6">
                <ToolLogo 
                  name={tool.name}
                  resolvedLogo={resolvedLogo}
                  size={72}
                  className="rounded-xl border border-gray-200 shadow-sm"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                    {tool.isOpenSource && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Code className="w-3 h-3 mr-1" />
                        Open Source
                      </span>
                    )}
                    {tool.license && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {tool.license}
                      </span>
                    )}
                  </div>

                  {tool.category && (
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                        {tool.category.name}
                      </span>
                    </p>
                  )}

                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {tool.githubStars && (
                      <span className="inline-flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {tool.githubStars.toLocaleString()} stars
                      </span>
                    )}
                    <span className="inline-flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added {formatDate(tool.createdAt)}
                    </span>
                    <span className="inline-flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {tool.features.length} features
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:shrink-0">
                {tool.websiteUrl && (
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
                {tool.repositoryUrl && (
                  <a
                    href={tool.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Features Section */}
              {tool.features.length > 0 && (
                <FeatureShowcase features={tool.features} />
              )}

              {/* Tech Stack Section */}
              {tool.techStacks.length > 0 && (
                <TechStackDisplay techStacks={tool.techStacks} />
              )}

              {/* Deployment Options */}
              {tool.deploymentOptions.length > 0 && (
                <DeploymentOptions deploymentOptions={tool.deploymentOptions} />
              )}

              {/* Alternatives Section */}
              {(tool.proprietaryAlternatives.length > 0 || tool.openSourceAlternatives.length > 0) && (
                <AlternativesComparison 
                  proprietaryAlternatives={tool.proprietaryAlternatives}
                  openSourceAlternatives={tool.openSourceAlternatives}
                />
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80">
              <ToolSidebar tool={tool} />
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}