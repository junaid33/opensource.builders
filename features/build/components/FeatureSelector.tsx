'use client'

import { useState, useEffect, useMemo } from 'react'
import { Star, Check, AlertTriangle, Info, Filter, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ToolIcon from '@/components/ToolIcon'
import { getToolFeaturesGrouped } from '../actions/getToolFeatures'
import { cn } from '@/lib/utils'
import type { Tool, SelectedFeature, FeatureConflict, FeatureType, ToolFeature } from '../types/build'

interface FeatureSelectorProps {
  selectedTools: Tool[]
  selectedFeatures: SelectedFeature[]
  onFeaturesSelect: (features: SelectedFeature[]) => void
  onConflictsDetected: (conflicts: FeatureConflict[]) => void
  className?: string
}

const FEATURE_TYPE_LABELS: Record<FeatureType, string> = {
  core: 'Core Functionality',
  integration: 'Integrations',
  ui_ux: 'UI/UX Components',
  api: 'API & Backend',
  security: 'Security Features',
  performance: 'Performance',
  analytics: 'Analytics',
  collaboration: 'Collaboration',
  deployment: 'Deployment',
  customization: 'Customization'
}

const FEATURE_TYPE_COLORS: Record<FeatureType, string> = {
  core: 'bg-blue-100 text-blue-800 border-blue-200',
  integration: 'bg-green-100 text-green-800 border-green-200',
  ui_ux: 'bg-purple-100 text-purple-800 border-purple-200',
  api: 'bg-orange-100 text-orange-800 border-orange-200',
  security: 'bg-red-100 text-red-800 border-red-200',
  performance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  analytics: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  collaboration: 'bg-pink-100 text-pink-800 border-pink-200',
  deployment: 'bg-gray-100 text-gray-800 border-gray-200',
  customization: 'bg-cyan-100 text-cyan-800 border-cyan-200'
}

export function FeatureSelector({
  selectedTools,
  selectedFeatures,
  onFeaturesSelect,
  onConflictsDetected,
  className
}: FeatureSelectorProps) {
  const [toolFeatures, setToolFeatures] = useState<Record<string, { tool: ToolFeature['tool'], features: ToolFeature[] }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'by-tool' | 'by-type'>('by-tool')
  const [filterType, setFilterType] = useState<FeatureType | 'all'>('all')
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set())

  // Load features for selected tools
  useEffect(() => {
    async function loadFeatures() {
      if (selectedTools.length === 0) {
        setToolFeatures({})
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const toolIds = selectedTools.map(tool => tool.id)
        const result = await getToolFeaturesGrouped(toolIds)

        if (!result.success) {
          throw new Error(result.error || 'Failed to load features')
        }

        setToolFeatures(result.data)
        
        // Auto-expand all tools initially
        setExpandedTools(new Set(Object.keys(result.data)))

      } catch (err) {
        console.error('Error loading features:', err)
        setError(err instanceof Error ? err.message : 'Failed to load features')
      } finally {
        setLoading(false)
      }
    }

    loadFeatures()
  }, [selectedTools])

  // Detect conflicts when features change
  useEffect(() => {
    const conflicts = detectFeatureConflicts(selectedFeatures)
    onConflictsDetected(conflicts)
  }, [selectedFeatures, onConflictsDetected])

  // Group features by type for type view
  const featuresByType = useMemo(() => {
    const grouped: Record<FeatureType, ToolFeature[]> = {} as Record<FeatureType, ToolFeature[]>
    
    Object.values(toolFeatures).forEach(({ features }) => {
      features.forEach(feature => {
        const type = feature.feature.featureType
        if (!grouped[type]) {
          grouped[type] = []
        }
        grouped[type].push(feature)
      })
    })

    // Sort features within each type by quality score
    Object.keys(grouped).forEach(type => {
      grouped[type as FeatureType].sort((a, b) => {
        if (a.verified && !b.verified) return -1
        if (!a.verified && b.verified) return 1
        return (b.qualityScore || 0) - (a.qualityScore || 0)
      })
    })

    return grouped
  }, [toolFeatures])

  // Filter features based on selected type
  const filteredFeaturesByType = useMemo(() => {
    if (filterType === 'all') return featuresByType
    
    return filterType in featuresByType 
      ? { [filterType]: featuresByType[filterType] }
      : {}
  }, [featuresByType, filterType])

  const handleFeatureToggle = (toolFeature: ToolFeature) => {
    const featureKey = `${toolFeature.tool.id}-${toolFeature.feature.id}`
    const isSelected = selectedFeatures.some(f => 
      f.toolId === toolFeature.tool.id && f.featureId === toolFeature.feature.id
    )

    if (isSelected) {
      onFeaturesSelect(selectedFeatures.filter(f => 
        !(f.toolId === toolFeature.tool.id && f.featureId === toolFeature.feature.id)
      ))
    } else {
      const newFeature: SelectedFeature = {
        toolId: toolFeature.tool.id,
        toolName: toolFeature.tool.name,
        toolRepositoryUrl: toolFeature.tool.repositoryUrl,
        featureId: toolFeature.feature.id,
        featureName: toolFeature.feature.name,
        featureDescription: toolFeature.feature.description,
        featureType: toolFeature.feature.featureType,
        qualityScore: toolFeature.qualityScore,
        implementationNotes: toolFeature.implementationNotes,
        verified: toolFeature.verified
      }
      
      onFeaturesSelect([...selectedFeatures, newFeature])
    }
  }

  const toggleToolExpansion = (toolId: string) => {
    const newExpanded = new Set(expandedTools)
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId)
    } else {
      newExpanded.add(toolId)
    }
    setExpandedTools(newExpanded)
  }

  if (selectedTools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          Please select tools first to see their features
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Back to Tool Selection
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          Failed to load features: {error}
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value="by-tool">By Tool</TabsTrigger>
              <TabsTrigger value="by-type">By Type</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === 'by-type' && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FeatureType | 'all')}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feature Types</SelectItem>
                {Object.entries(FEATURE_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Selected Features Summary */}
      {selectedFeatures.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Selected Features ({selectedFeatures.length})
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFeaturesSelect([])}
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map(feature => (
              <Badge 
                key={`${feature.toolId}-${feature.featureId}`}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  onFeaturesSelect(selectedFeatures.filter(f => 
                    !(f.toolId === feature.toolId && f.featureId === feature.featureId)
                  ))
                }}
              >
                {feature.featureName} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Feature Lists */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'by-tool' ? (
        <ToolFeatureView
          toolFeatures={toolFeatures}
          selectedFeatures={selectedFeatures}
          expandedTools={expandedTools}
          onFeatureToggle={handleFeatureToggle}
          onToolToggle={toggleToolExpansion}
        />
      ) : (
        <TypeFeatureView
          featuresByType={filteredFeaturesByType}
          selectedFeatures={selectedFeatures}
          onFeatureToggle={handleFeatureToggle}
        />
      )}

      {/* Continue Button */}
      {selectedFeatures.length > 0 && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4 -mx-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedFeatures.length} feature{selectedFeatures.length === 1 ? '' : 's'} selected
            </div>
            <Button>
              Generate Prompt →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for tool-based view
function ToolFeatureView({
  toolFeatures,
  selectedFeatures,
  expandedTools,
  onFeatureToggle,
  onToolToggle
}: {
  toolFeatures: Record<string, { tool: ToolFeature['tool'], features: ToolFeature[] }>
  selectedFeatures: SelectedFeature[]
  expandedTools: Set<string>
  onFeatureToggle: (feature: ToolFeature) => void
  onToolToggle: (toolId: string) => void
}) {
  return (
    <div className="space-y-4">
      {Object.entries(toolFeatures).map(([toolId, { tool, features }]) => {
        const isExpanded = expandedTools.has(toolId)
        const selectedCount = selectedFeatures.filter(f => f.toolId === toolId).length
        
        return (
          <Card key={toolId}>
            <Collapsible open={isExpanded} onOpenChange={() => onToolToggle(toolId)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ToolIcon
                        name={tool.name}
                        size={24}
                      />
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription>
                          {features.length} features available
                          {selectedCount > 0 && ` • ${selectedCount} selected`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedCount > 0 && (
                        <Badge variant="secondary">
                          {selectedCount} selected
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {features.map(feature => (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        isSelected={selectedFeatures.some(f => 
                          f.toolId === feature.tool.id && f.featureId === feature.feature.id
                        )}
                        onToggle={() => onFeatureToggle(feature)}
                      />
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}

// Component for type-based view
function TypeFeatureView({
  featuresByType,
  selectedFeatures,
  onFeatureToggle
}: {
  featuresByType: Record<FeatureType, ToolFeature[]>
  selectedFeatures: SelectedFeature[]
  onFeatureToggle: (feature: ToolFeature) => void
}) {
  return (
    <div className="space-y-6">
      {Object.entries(featuresByType).map(([type, features]) => (
        <div key={type}>
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={FEATURE_TYPE_COLORS[type as FeatureType]}>
              {FEATURE_TYPE_LABELS[type as FeatureType]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {features.length} features
            </span>
          </div>
          
          <div className="grid gap-3">
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                showTool={true}
                isSelected={selectedFeatures.some(f => 
                  f.toolId === feature.tool.id && f.featureId === feature.feature.id
                )}
                onToggle={() => onFeatureToggle(feature)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Individual feature card component
function FeatureCard({
  feature,
  isSelected,
  onToggle,
  showTool = false
}: {
  feature: ToolFeature
  isSelected: boolean
  onToggle: () => void
  showTool?: boolean
}) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium">{feature.feature.name}</h4>
            {feature.verified && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {feature.qualityScore && (
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {feature.qualityScore}/10
              </Badge>
            )}
            {showTool && (
              <Badge variant="secondary" className="text-xs">
                {feature.tool.name}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {feature.feature.description}
          </p>
          
          {feature.implementationNotes && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
              <strong>Implementation Notes:</strong> {feature.implementationNotes}
            </div>
          )}
        </div>
        
        <Checkbox 
          checked={isSelected}
          onChange={() => {}} // Handled by card click
          className="ml-3"
        />
      </div>
    </div>
  )
}

// Simple conflict detection (can be enhanced)
function detectFeatureConflicts(selectedFeatures: SelectedFeature[]): FeatureConflict[] {
  const conflicts: FeatureConflict[] = []
  
  // Check for multiple auth systems
  const authFeatures = selectedFeatures.filter(f => 
    f.featureName.toLowerCase().includes('auth') || 
    f.featureName.toLowerCase().includes('login') ||
    f.featureType === 'security'
  )
  
  if (authFeatures.length > 1) {
    for (let i = 0; i < authFeatures.length - 1; i++) {
      conflicts.push({
        feature1: authFeatures[i],
        feature2: authFeatures[i + 1],
        conflictType: 'incompatible',
        severity: 'warning',
        resolution: 'Consider using only one authentication system to avoid conflicts'
      })
    }
  }
  
  return conflicts
}