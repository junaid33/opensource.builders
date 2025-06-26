import Link from 'next/link'
import { ArrowLeft, ExternalLink, Star, Calendar, Shield, Code, Users, Zap, Sparkles } from 'lucide-react'
import ToolLogo from '@/features/landing/components/ToolLogo'
import ToolSidebar from './ToolSidebar'
import FeatureShowcase from './FeatureShowcase'
import AlternativesComparison from './AlternativesComparison'
import TechStackDisplay from './TechStackDisplay'
import DeploymentOptions from './DeploymentOptions'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-16">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Link>
            </Button>
          </div>

          {/* Hero Section */}
          <Card className="bg-background/95 backdrop-blur-sm border-border shadow-xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <CardContent className="p-8 relative">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                
                {/* Logo and Basic Info */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <ToolLogo 
                      name={tool.name}
                      resolvedLogo={resolvedLogo}
                      size={72}
                      className="rounded-xl border border-border shadow-lg ring-4 ring-background"
                    />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{tool.name}</h1>
                      {tool.isOpenSource && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
                          <Code className="w-3 h-3 mr-1" />
                          Open Source
                        </Badge>
                      )}
                      {tool.license && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900">
                          <Shield className="w-3 h-3 mr-1" />
                          {tool.license}
                        </Badge>
                      )}
                    </div>

                    {tool.category && (
                      <div className="mb-4">
                        <Badge variant="outline" className="text-sm">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {tool.category.name}
                        </Badge>
                      </div>
                    )}

                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {tool.githubStars && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {tool.githubStars.toLocaleString()} stars
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Added {formatDate(tool.createdAt)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {tool.features.length} features
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:shrink-0">
                  {tool.websiteUrl && (
                    <Button size="lg" asChild>
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {tool.repositoryUrl && (
                    <Button variant="outline" size="lg" asChild>
                      <a
                        href={tool.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
            <div className="lg:w-80">
              <ToolSidebar tool={tool} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}