import { ExternalLink, Star, Shield, Calendar, Code, Users, MapPin, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ToolSidebarProps {
  tool: {
    id: string
    name: string
    websiteUrl?: string
    repositoryUrl?: string
    license?: string
    githubStars?: number
    isOpenSource: boolean
    createdAt: string
    category?: {
      name: string
      slug: string
    }
    features: Array<any>
    proprietaryAlternatives: Array<any>
    openSourceAlternatives: Array<any>
    techStacks: Array<any>
    deploymentOptions: Array<any>
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

export default function ToolSidebar({ tool }: ToolSidebarProps) {
  const stats = [
    {
      label: 'Features',
      value: tool.features.length,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      label: 'Tech Stacks',
      value: tool.techStacks.length,
      icon: Code,
      color: 'text-blue-600'
    },
    {
      label: 'Deployment Options',
      value: tool.deploymentOptions.length,
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      label: 'Alternatives',
      value: tool.proprietaryAlternatives.length + tool.openSourceAlternatives.length,
      icon: Users,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="sticky top-8 space-y-6">
      
      {/* Quick Stats Card */}
      <Card className="bg-background border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="bg-primary/10 rounded-md p-1.5 mr-3">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.label}
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {stat.value}
                </Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Tool Info Card */}
      <Card className="bg-background border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Tool Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Category */}
          {tool.category && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <dt className="text-sm font-medium text-muted-foreground mb-1">Category</dt>
              <dd className="text-sm text-foreground font-medium">{tool.category.name}</dd>
            </div>
          )}

          {/* License */}
          {tool.license && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <dt className="text-sm font-medium text-muted-foreground mb-1">License</dt>
              <dd className="flex items-center text-sm text-foreground">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                <Badge variant="outline">{tool.license}</Badge>
              </dd>
            </div>
          )}

          {/* GitHub Stars */}
          {tool.githubStars && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <dt className="text-sm font-medium text-muted-foreground mb-1">GitHub Stars</dt>
              <dd className="flex items-center text-sm text-foreground">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <Badge variant="outline" className="font-semibold">
                  {tool.githubStars.toLocaleString()}
                </Badge>
              </dd>
            </div>
          )}

          {/* Open Source Status */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <dt className="text-sm font-medium text-muted-foreground mb-1">Type</dt>
            <dd className="flex items-center text-sm text-foreground">
              <Code className="w-4 h-4 mr-2 text-green-500" />
              <Badge variant={tool.isOpenSource ? "default" : "secondary"}>
                {tool.isOpenSource ? 'Open Source' : 'Proprietary'}
              </Badge>
            </dd>
          </div>

          {/* Added Date */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <dt className="text-sm font-medium text-muted-foreground mb-1">Added</dt>
            <dd className="flex items-center text-sm text-foreground">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              {formatDate(tool.createdAt)}
            </dd>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons Card */}
      <Card className="bg-background border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          
          {tool.websiteUrl && (
            <Button
              variant="default"
              className="w-full justify-center"
              asChild
            >
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
            <Button
              variant="outline"
              className="w-full justify-center"
              asChild
            >
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

          {!tool.websiteUrl && !tool.repositoryUrl && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                No external links available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Types Summary */}
      {tool.features.length > 0 && (
        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Feature Types</CardTitle>
            <CardDescription>
              Breakdown by feature categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                tool.features.reduce((acc: Record<string, number>, feature) => {
                  const type = feature.feature.featureType || 'Other'
                  acc[type] = (acc[type] || 0) + 1
                  return acc
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground capitalize font-medium">
                    {type.replace('_', ' ')}
                  </span>
                  <Badge variant="secondary" className="font-semibold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}