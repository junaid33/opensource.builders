import { 
  ExternalLink, 
  Clock, 
  Gauge, 
  CheckCircle2, 
  AlertCircle, 
  Cloud, 
  Download, 
  Server, 
  Package, 
  Zap,
  Layers
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DeploymentOption {
  id: string
  platform: string
  deployUrl?: string
  templateUrl?: string
  difficulty?: string
  estimatedTime?: string
  requirements?: any
  isVerified: boolean
}

interface DeploymentOptionsProps {
  deploymentOptions: DeploymentOption[]
}

function getDifficultyIcon(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return CheckCircle2
    case 'intermediate':
      return Gauge
    case 'advanced':
    case 'expert':
      return AlertCircle
    default:
      return Clock
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900'
    case 'advanced':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900'
    case 'expert':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}

function getPlatformIcon(platform: string) {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('docker')) return Server
  if (platformLower.includes('cloud')) return Cloud
  if (platformLower.includes('download')) return Download
  if (platformLower.includes('package')) return Package
  return Server
}

export default function DeploymentOptions({ deploymentOptions }: DeploymentOptionsProps) {
  // Group deployment options by difficulty
  const optionsByDifficulty = deploymentOptions.reduce((acc, option) => {
    const difficulty = option.difficulty || 'Unknown'
    if (!acc[difficulty]) {
      acc[difficulty] = []
    }
    acc[difficulty].push(option)
    return acc
  }, {} as Record<string, DeploymentOption[]>)

  // Sort by difficulty order
  const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'Unknown']
  const sortedDifficulties = Object.entries(optionsByDifficulty)
    .sort(([a], [b]) => {
      const aIndex = difficultyOrder.indexOf(a.toLowerCase())
      const bIndex = difficultyOrder.indexOf(b.toLowerCase())
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    })

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Deployment Options</CardTitle>
            <CardDescription className="mt-1.5">
              {deploymentOptions.length} deployment method{deploymentOptions.length !== 1 ? 's' : ''} available
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <Layers className="h-3.5 w-3.5" />
            <span>{deploymentOptions.length} Options</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {sortedDifficulties.length > 0 ? (
          <div className="space-y-8">
            {sortedDifficulties.map(([difficulty, options]) => {
              const DifficultyIcon = getDifficultyIcon(difficulty)
              const difficultyColor = getDifficultyColor(difficulty)
              
              return (
                <div key={difficulty} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("font-medium", difficultyColor)}>
                        <DifficultyIcon className="w-3.5 h-3.5 mr-1" />
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {options.length} option{options.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {options.map((option) => {
                      const PlatformIcon = getPlatformIcon(option.platform)
                      
                      return (
                        <Card 
                          key={option.id}
                          className="bg-card border-border overflow-hidden transition-all hover:shadow-md"
                        >
                          <CardHeader className="p-4 pb-2 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 rounded-md p-1.5">
                                  <PlatformIcon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-foreground">
                                    {option.platform}
                                  </h4>
                                  {option.estimatedTime && (
                                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>{option.estimatedTime}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {option.isVerified && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Verified</span>
                                </Badge>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 pt-0">
                            {/* Requirements */}
                            {option.requirements && (
                              <div className="mt-2 mb-3">
                                <h5 className="text-xs font-medium text-muted-foreground mb-1">Requirements:</h5>
                                <div className="text-sm text-foreground bg-muted/50 rounded-md p-2 overflow-auto max-h-20">
                                  {typeof option.requirements === 'string' 
                                    ? option.requirements
                                    : JSON.stringify(option.requirements, null, 2)
                                  }
                                </div>
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
                            {option.templateUrl && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-8"
                                asChild
                              >
                                <a
                                  href={option.templateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Template
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </Button>
                            )}
                            
                            {option.deployUrl && (
                              <Button 
                                variant="default" 
                                size="sm"
                                className="text-xs h-8"
                                asChild
                              >
                                <a
                                  href={option.deployUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Deploy
                                </a>
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No deployment options available</p>
          </div>
        )}
      </CardContent>

      {/* Deployment Summary */}
      {deploymentOptions.length > 0 && (
        <>
          <Separator className="my-2" />
          <CardFooter className="p-6">
            <div className="w-full">
              <h4 className="font-medium text-foreground mb-4">Deployment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard 
                  value={deploymentOptions.length.toString()} 
                  label="Total Options" 
                  icon={Layers}
                />
                
                <SummaryCard 
                  value={deploymentOptions.filter(opt => opt.isVerified).length.toString()} 
                  label="Verified" 
                  icon={CheckCircle2}
                />
                
                <SummaryCard 
                  value={deploymentOptions.filter(opt => opt.deployUrl).length.toString()} 
                  label="One-Click Deploy" 
                  icon={Zap}
                />
                
                <SummaryCard 
                  value={deploymentOptions.filter(opt => opt.difficulty?.toLowerCase() === 'beginner').length.toString()} 
                  label="Beginner-Friendly" 
                  icon={CheckCircle2}
                />
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

interface SummaryCardProps {
  value: string
  label: string
  icon: React.ElementType
}

function SummaryCard({ value, label, icon: Icon }: SummaryCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className="flex justify-center mb-1">
        <div className="bg-primary/10 rounded-full p-1.5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}