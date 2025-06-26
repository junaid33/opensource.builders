import { ExternalLink, Star, Shield, Calendar, Code, Users, MapPin } from 'lucide-react'

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
      icon: Star
    },
    {
      label: 'Tech Stacks',
      value: tool.techStacks.length,
      icon: Code
    },
    {
      label: 'Deployment Options',
      value: tool.deploymentOptions.length,
      icon: MapPin
    },
    {
      label: 'Alternatives',
      value: tool.proprietaryAlternatives.length + tool.openSourceAlternatives.length,
      icon: Users
    }
  ]

  return (
    <div className="sticky top-8 space-y-6">
      
      {/* Quick Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Icon className="w-4 h-4 mr-2" />
                  {stat.label}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stat.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tool Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Information</h3>
        <div className="space-y-4">
          
          {/* Category */}
          {tool.category && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
              <dd className="text-sm text-gray-900">{tool.category.name}</dd>
            </div>
          )}

          {/* License */}
          {tool.license && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">License</dt>
              <dd className="flex items-center text-sm text-gray-900">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                {tool.license}
              </dd>
            </div>
          )}

          {/* GitHub Stars */}
          {tool.githubStars && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">GitHub Stars</dt>
              <dd className="flex items-center text-sm text-gray-900">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {tool.githubStars.toLocaleString()}
              </dd>
            </div>
          )}

          {/* Open Source Status */}
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Type</dt>
            <dd className="flex items-center text-sm text-gray-900">
              <Code className="w-4 h-4 mr-2 text-green-500" />
              {tool.isOpenSource ? 'Open Source' : 'Proprietary'}
            </dd>
          </div>

          {/* Added Date */}
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Added</dt>
            <dd className="flex items-center text-sm text-gray-900">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {formatDate(tool.createdAt)}
            </dd>
          </div>
        </div>
      </div>

      {/* Action Buttons Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
        <div className="space-y-3">
          
          {tool.websiteUrl && (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors"
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
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Code className="w-4 h-4 mr-2" />
              Source Code
            </a>
          )}

          {!tool.websiteUrl && !tool.repositoryUrl && (
            <p className="text-sm text-gray-500 text-center py-4">
              No external links available
            </p>
          )}
        </div>
      </div>

      {/* Feature Types Summary */}
      {tool.features.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Types</h3>
          <div className="space-y-2">
            {Object.entries(
              tool.features.reduce((acc: Record<string, number>, feature) => {
                const type = feature.feature.featureType || 'Other'
                acc[type] = (acc[type] || 0) + 1
                return acc
              }, {})
            ).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {type.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}