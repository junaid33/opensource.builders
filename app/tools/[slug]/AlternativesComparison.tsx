import Link from 'next/link'
import { ExternalLink, Star, Code, ArrowRight, Building2, GitBranch } from 'lucide-react'
import ToolLogo from '@/features/landing/components/ToolLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

  const totalAlternatives = proprietaryAlternatives.length + openSourceAlternatives.length

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Alternatives</CardTitle>
            <CardDescription className="mt-1.5">
              Compare similar tools and find the best fit for your needs
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>{totalAlternatives} Options</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        
        {/* Proprietary Alternatives */}
        {hasProprietaryAlternatives && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900">
                <Building2 className="w-3.5 h-3.5 mr-1" />
                Proprietary Alternatives
              </Badge>
              <span className="text-sm text-muted-foreground">
                {proprietaryAlternatives.length} tool{proprietaryAlternatives.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {proprietaryAlternatives.map((alt) => {
                const tool = alt.proprietaryTool
                const resolvedLogo = createResolvedLogo(tool)
                
                return (
                  <Card key={tool.id} className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-md">
                    <CardContent className="p-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:from-orange-900/10" />
                      <div className="relative flex items-start gap-4">
                        <ToolLogo 
                          name={tool.name}
                          resolvedLogo={resolvedLogo}
                          size={48}
                          className="rounded-lg border border-border shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {tool.description}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {tool.websiteUrl && (
                              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <a
                                  href={tool.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Visit Website
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {hasProprietaryAlternatives && hasOpenSourceAlternatives && (
          <Separator />
        )}

        {/* Open Source Alternatives */}
        {hasOpenSourceAlternatives && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
                <Code className="w-3.5 h-3.5 mr-1" />
                Open Source Alternatives
              </Badge>
              <span className="text-sm text-muted-foreground">
                {openSourceAlternatives.length} tool{openSourceAlternatives.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {openSourceAlternatives.map((alt) => {
                const tool = alt.openSourceTool
                const resolvedLogo = createResolvedLogo(tool)
                
                return (
                  <Card key={tool.id} className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-md">
                    <CardContent className="p-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:from-green-900/10" />
                      <div className="relative flex items-start gap-4">
                        <ToolLogo 
                          name={tool.name}
                          resolvedLogo={resolvedLogo}
                          size={48}
                          className="rounded-lg border border-border shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {tool.name}
                            </h4>
                            {tool.license && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 shrink-0">
                                {tool.license}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {tool.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {tool.githubStars && (
                                <span className="inline-flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                  {tool.githubStars.toLocaleString()}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {tool.websiteUrl && (
                                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                  <a
                                    href={tool.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Website
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </Button>
                              )}
                              {tool.repositoryUrl && (
                                <Button variant="default" size="sm" className="h-7 text-xs" asChild>
                                  <a
                                    href={tool.repositoryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Code className="w-3 h-3 mr-1" />
                                    Code
                                  </a>
                                </Button>
                              )}
                              <Button variant="secondary" size="sm" className="h-7 text-xs" asChild>
                                <Link href={`/tools/${tool.slug}`}>
                                  Details
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Comparison Summary */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground mb-3">Alternative Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border">
              <div className="text-xl font-bold text-foreground">{totalAlternatives}</div>
              <div className="text-xs text-muted-foreground text-center">Total Alternatives</div>
            </div>
            
            {hasProprietaryAlternatives && (
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border">
                <div className="text-xl font-bold text-foreground">{proprietaryAlternatives.length}</div>
                <div className="text-xs text-muted-foreground text-center">Proprietary Options</div>
              </div>
            )}
            
            {hasOpenSourceAlternatives && (
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border">
                <div className="text-xl font-bold text-foreground">{openSourceAlternatives.length}</div>
                <div className="text-xs text-muted-foreground text-center">Open Source Options</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}