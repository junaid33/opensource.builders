'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Star, Zap, Cog, Palette, Users, Shield, BarChart, Cloud, Search } from 'lucide-react'

interface Feature {
  feature: {
    id: string
    name: string
    slug: string
    description: string
    featureType: string
  }
}

interface FeatureShowcaseProps {
  features: Feature[]
}

function getFeatureTypeIcon(type: string) {
  switch (type) {
    case 'core':
      return Star
    case 'integration':
      return Zap
    case 'customization':
      return Cog
    case 'ui_ux':
      return Palette
    case 'collaboration':
      return Users
    case 'security':
      return Shield
    case 'analytics':
      return BarChart
    case 'deployment':
      return Cloud
    default:
      return Search
  }
}

function getFeatureTypeColor(type: string) {
  switch (type) {
    case 'core':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'integration':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'customization':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'ui_ux':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    case 'collaboration':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'security':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'analytics':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'deployment':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function FeatureShowcase({ features }: FeatureShowcaseProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['core']))

  // Group features by type
  const featuresByType = features.reduce((acc, feature) => {
    const type = feature.feature.featureType || 'other'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  const formatTypeName = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Features</h2>
        <p className="text-gray-600">
          {features.length} features across {Object.keys(featuresByType).length} categories
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {Object.entries(featuresByType)
          .sort(([, a], [, b]) => b.length - a.length) // Sort by feature count
          .map(([type, typeFeatures]) => {
            const Icon = getFeatureTypeIcon(type)
            const isExpanded = expandedTypes.has(type)
            
            return (
              <div key={type} className="p-6">
                <button
                  onClick={() => toggleType(type)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getFeatureTypeColor(type)} mr-3`}>
                      <Icon className="w-4 h-4 mr-1.5" />
                      {formatTypeName(type)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {typeFeatures.length} feature{typeFeatures.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {typeFeatures.map((feature) => (
                      <div 
                        key={feature.feature.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {feature.feature.name}
                        </h4>
                        {feature.feature.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.feature.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Feature Summary Stats */}
      <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(featuresByType)
            .sort(([, a], [, b]) => b.length - a.length)
            .slice(0, 4)
            .map(([type, typeFeatures]) => {
              const Icon = getFeatureTypeIcon(type)
              return (
                <div key={type} className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 mb-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {typeFeatures.length}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {formatTypeName(type)}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}