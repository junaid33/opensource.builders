'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Star, Zap, Cog, Palette, Users, Shield, BarChart, Cloud, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

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
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900'
    case 'integration':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900'
    case 'customization':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900'
    case 'ui_ux':
      return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-900'
    case 'collaboration':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
    case 'security':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
    case 'analytics':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900'
    case 'deployment':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
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
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Features</CardTitle>
        <CardDescription>
          {features.length} features across {Object.keys(featuresByType).length} categories
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.entries(featuresByType)
          .sort(([, a], [, b]) => b.length - a.length) // Sort by feature count
          .map(([type, typeFeatures]) => {
            const Icon = getFeatureTypeIcon(type)
            const isExpanded = expandedTypes.has(type)
            const colorClass = getFeatureTypeColor(type)
            
            return (
              <Collapsible
                key={type}
                open={isExpanded}
                onOpenChange={() => toggleType(type)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={cn("font-medium", colorClass)}>
                        <Icon className="w-4 h-4 mr-1.5" />
                        {formatTypeName(type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {typeFeatures.length} feature{typeFeatures.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-4 pb-4">
                  <div className="grid gap-3 mt-3">
                    {typeFeatures.map((feature) => (
                      <Card 
                        key={feature.feature.id}
                        className="group transition-all hover:border-primary/50 hover:shadow-sm"
                      >
                        <CardContent className="p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative">
                            <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {feature.feature.name}
                            </h4>
                            {feature.feature.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.feature.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
      </CardContent>

      {/* Feature Summary Stats */}
      <div className="p-6 bg-muted/30 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">Feature Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(featuresByType)
            .sort(([, a], [, b]) => b.length - a.length)
            .slice(0, 4)
            .map(([type, typeFeatures]) => {
              const Icon = getFeatureTypeIcon(type)
              const colorClass = getFeatureTypeColor(type)
              const baseColorClass = colorClass.split(' ')[0]
              
              return (
                <div key={type} className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${baseColorClass} mb-2`}>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {typeFeatures.length}
                  </div>
                  <div className="text-xs text-muted-foreground text-center capitalize">
                    {formatTypeName(type)}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </Card>
  )
}