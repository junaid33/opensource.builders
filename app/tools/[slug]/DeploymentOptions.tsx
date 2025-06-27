import { 
  ExternalLink, 
  Cloud, 
  Download, 
  Server, 
  Package, 
  Zap,
  Layers,
  Rocket
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeploymentOption {
  id: string
  platform: string
  deployUrl?: string
}

interface DeploymentOptionsProps {
  deploymentOptions: DeploymentOption[]
}

function getPlatformIcon(platform: string) {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('vercel')) return Zap
  if (platformLower.includes('netlify')) return Rocket
  if (platformLower.includes('railway')) return Server
  if (platformLower.includes('render')) return Cloud
  if (platformLower.includes('docker')) return Server
  if (platformLower.includes('cloud')) return Cloud
  if (platformLower.includes('download')) return Download
  if (platformLower.includes('package')) return Package
  return Server
}

export default function DeploymentOptions({ deploymentOptions }: DeploymentOptionsProps) {
  if (!deploymentOptions || deploymentOptions.length === 0) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle>Deployment Options</CardTitle>
          <CardDescription>No deployment options available yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Deployment Options</CardTitle>
            <CardDescription className="mt-1.5">
              One-click deployment available on {deploymentOptions.length} platform{deploymentOptions.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <Layers className="h-3.5 w-3.5" />
            <span>{deploymentOptions.length} Options</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deploymentOptions.map((option) => {
            const PlatformIcon = getPlatformIcon(option.platform)
            
            return (
              <Card 
                key={option.id}
                className="bg-card border-border overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-md p-2">
                      <PlatformIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {option.platform}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        One-click deploy
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {option.deployUrl && (
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={option.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Rocket className="w-4 h-4" />
                        Deploy Now
                      </a>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="border-t">
        <p className="text-sm text-muted-foreground">
          All deployment options are pre-configured for quick setup
        </p>
      </CardFooter>
    </Card>
  )
}