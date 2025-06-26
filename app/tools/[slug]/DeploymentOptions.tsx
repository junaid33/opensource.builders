import { ExternalLink, Clock, Gauge, CheckCircle2, AlertCircle, Cloud, Download, Server, Package } from 'lucide-react'

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
      return 'bg-green-100 text-green-800 border-green-200'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'advanced':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'expert':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
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
      const aIndex = difficultyOrder.indexOf(a)
      const bIndex = difficultyOrder.indexOf(b)
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deployment Options</h2>
        <p className="text-gray-600">
          {deploymentOptions.length} deployment method{deploymentOptions.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="p-6">
        {sortedDifficulties.length > 0 ? (
          <div className="space-y-6">
            {sortedDifficulties.map(([difficulty, options]) => {
              const DifficultyIcon = getDifficultyIcon(difficulty)
              const difficultyColor = getDifficultyColor(difficulty)
              
              return (
                <div key={difficulty}>
                  <div className="flex items-center mb-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${difficultyColor} mr-3`}>
                      <DifficultyIcon className="w-4 h-4 mr-1.5" />
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {options.length} option{options.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {options.map((option) => {
                      const PlatformIcon = getPlatformIcon(option.platform)
                      
                      return (
                        <div
                          key={option.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <PlatformIcon className="w-5 h-5 text-gray-600 mr-2" />
                              <h4 className="font-semibold text-gray-900">
                                {option.platform}
                              </h4>
                            </div>
                            
                            {option.isVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>

                          {/* Time Estimate */}
                          {option.estimatedTime && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>Estimated time: {option.estimatedTime}</span>
                            </div>
                          )}

                          {/* Requirements */}
                          {option.requirements && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">Requirements:</h5>
                              <div className="text-sm text-gray-600">
                                {typeof option.requirements === 'string' 
                                  ? option.requirements
                                  : JSON.stringify(option.requirements)
                                }
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {option.deployUrl && (
                              <a
                                href={option.deployUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                              >
                                Deploy Now
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                            
                            {option.templateUrl && (
                              <a
                                href={option.templateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                Template
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No deployment options available</p>
          </div>
        )}

        {/* Deployment Summary */}
        {deploymentOptions.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Deployment Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {deploymentOptions.length}
                </div>
                <div className="text-sm text-gray-500">Total Options</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {deploymentOptions.filter(opt => opt.isVerified).length}
                </div>
                <div className="text-sm text-gray-500">Verified</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {deploymentOptions.filter(opt => opt.deployUrl).length}
                </div>
                <div className="text-sm text-gray-500">One-Click Deploy</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {deploymentOptions.filter(opt => opt.difficulty === 'beginner').length}
                </div>
                <div className="text-sm text-gray-500">Beginner-Friendly</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}