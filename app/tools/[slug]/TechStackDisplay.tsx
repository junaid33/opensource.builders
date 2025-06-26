import { Code, Database, Globe, Server, Smartphone, Cpu } from 'lucide-react'

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
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'database':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'frontend':
    case 'ui':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'backend':
    case 'server':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'mobile':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tech Stack</h2>
        <p className="text-gray-600">
          {techStacks.length} technologies across {Object.keys(stacksByCategory).length} categories
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {sortedCategories.map(([category, stacks]) => {
            const Icon = getTechStackIcon(category)
            const colorClass = getTechStackColor(category)
            
            return (
              <div key={category}>
                <div className="flex items-center mb-3">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${colorClass} mr-3`}>
                    <Icon className="w-4 h-4 mr-1.5" />
                    {formatCategoryName(category)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {stacks.length} technolog{stacks.length !== 1 ? 'ies' : 'y'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stacks.map((stack) => (
                    <div
                      key={stack.techStack.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {stack.techStack.name}
                      </h4>
                      {stack.techStack.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {stack.techStack.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech Stack Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Technology Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sortedCategories.slice(0, 4).map(([category, stacks]) => {
              const Icon = getTechStackIcon(category)
              return (
                <div key={category} className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 mb-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {stacks.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCategoryName(category)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}