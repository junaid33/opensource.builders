import { Code, Database, Globe, Server, Smartphone, Cpu } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TechStack {
  techStack: {
    id: string
    name: string
    slug: string
    description: string
    category: string
  }
}

interface TechStackDisplayProps {
  techStacks: TechStack[]
}

function getTechStackIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'programming_language':
    case 'language':
      return Code
    case 'database':
      return Database
    case 'frontend':
    case 'ui':
      return Globe
    case 'backend':
    case 'server':
      return Server
    case 'mobile':
      return Smartphone
    default:
      return Cpu
  }
}

function getTechStackColor(category: string) {
  switch (category.toLowerCase()) {
    case 'programming_language':
    case 'language':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
    case 'database':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800'
    case 'frontend':
    case 'ui':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
    case 'backend':
    case 'server':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800'
    case 'mobile':
      return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700'
  }
}

function formatCategoryName(category: string) {
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export default function TechStackDisplay({ techStacks }: TechStackDisplayProps) {
  // Group tech stacks by category
  const stacksByCategory = techStacks.reduce((acc, stack) => {
    const category = stack.techStack.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(stack)
    return acc
  }, {} as Record<string, TechStack[]>)

  // Sort categories by number of stacks
  const sortedCategories = Object.entries(stacksByCategory)
    .sort(([, a], [, b]) => b.length - a.length)

  const totalTechnologies = techStacks.length
  const totalCategories = Object.keys(stacksByCategory).length

  return (
    <Card className="bg-background border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">Tech Stack</h2>
        <p className="text-muted-foreground">
          {totalTechnologies} technologies across {totalCategories} categories
        </p>
      </div>

      <CardContent className="p-6">
        {/* Tech Stack Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="col-span-full font-medium text-foreground mb-3">Technology Overview</h4>
          {sortedCategories.slice(0, 4).map(([category, stacks]) => {
            const Icon = getTechStackIcon(category)
            const colorClass = getTechStackColor(category)
            const baseColorClass = colorClass.split(' ')[0]
            
            return (
              <div key={category} className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${baseColorClass} mb-2`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {stacks.length}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {formatCategoryName(category)}
                </div>
              </div>
            )
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-8">
          {sortedCategories.map(([category, stacks]) => {
            const Icon = getTechStackIcon(category)
            const colorClass = getTechStackColor(category)
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${colorClass}`}>
                    <Icon className="w-4 h-4 mr-1.5" />
                    {formatCategoryName(category)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {stacks.length} technolog{stacks.length !== 1 ? 'ies' : 'y'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stacks.map((stack) => (
                    <Card
                      key={stack.techStack.id}
                      className="group overflow-hidden hover:border-primary/50 transition-all duration-200"
                    >
                      <CardContent className="p-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <h4 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                            {stack.techStack.name}
                          </h4>
                          {stack.techStack.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {stack.techStack.description}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}