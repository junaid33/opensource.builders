'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Star, ExternalLink, Github, Filter, Loader2, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { DisplayCard } from '@/features/landing/components/display-card'
import { cn } from '@/lib/utils'
import type { Tool, FilterOptions } from '../types/build'

interface ToolSelectorProps {
  selectedTools: Tool[]
  onToolsSelect: (tools: Tool[]) => void
  initialTools: Tool[]
  initialCategories: Category[]
  className?: string
}

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  toolCount: number
}

export function ToolSelector({ selectedTools, onToolsSelect, initialTools, initialCategories, className }: ToolSelectorProps) {
  const [tools] = useState<Tool[]>(initialTools)
  const [categories] = useState<Category[]>(initialCategories)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categories: [],
    minStars: 0,
    sortBy: 'stars',
    sortOrder: 'desc'
  })

  // Filter tools based on current filters
  const filteredTools = useMemo(() => {
    let filtered = [...tools]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(tool => 
        tool.category && filters.categories!.includes(tool.category.slug)
      )
    }

    // Minimum stars filter
    if (filters.minStars && filters.minStars > 0) {
      filtered = filtered.filter(tool => 
        (tool.githubStars || 0) >= filters.minStars!
      )
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          const nameComparison = a.name.localeCompare(b.name)
          return filters.sortOrder === 'asc' ? nameComparison : -nameComparison
        case 'updated':
          // Since we don't have updatedAt in our data, fall back to stars
          const starsA = a.githubStars || 0
          const starsB = b.githubStars || 0
          return filters.sortOrder === 'asc' ? starsA - starsB : starsB - starsA
        case 'stars':
        default:
          const starsCompA = a.githubStars || 0
          const starsCompB = b.githubStars || 0
          return filters.sortOrder === 'asc' ? starsCompA - starsCompB : starsCompB - starsCompA
      }
    })

    return filtered
  }, [tools, filters])

  const handleToolToggle = (tool: Tool) => {
    const isSelected = selectedTools.some(t => t.id === tool.id)
    
    if (isSelected) {
      onToolsSelect(selectedTools.filter(t => t.id !== tool.id))
    } else {
      onToolsSelect([...selectedTools, tool])
    }
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      minStars: 0,
      sortBy: 'stars',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = filters.search || 
                          (filters.categories && filters.categories.length > 0) || 
                          (filters.minStars && filters.minStars > 0)

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          Failed to load tools: {error}
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Select MIT Open Source Tools</h2>
        <p className="text-muted-foreground">
          Choose from {tools.length} curated MIT-licensed tools to build your project.
        </p>
      </div>

      {/* Filter Bar - Inspired by dashboard FilterBar */}
      <div className="space-y-4">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="pl-9 w-full h-10 rounded-lg placeholder:text-muted-foreground/80 text-sm"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search tools by name or description..."
            />
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <Select
              value={filters.categories?.join(',') || 'all'}
              onValueChange={(value) => 
                handleFilterChange({ 
                  categories: value === 'all' ? [] : value.split(',')
                })
              }
            >
              <SelectTrigger className="lg:px-4 lg:py-2 lg:w-auto rounded-lg min-w-32">
                <SlidersHorizontal className="stroke-muted-foreground mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Category</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.toolCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stars Filter */}
            <Select
              value={filters.minStars?.toString() || '0'}
              onValueChange={(value) => 
                handleFilterChange({ minStars: parseInt(value) })
              }
            >
              <SelectTrigger className="lg:px-4 lg:py-2 lg:w-auto rounded-lg min-w-32">
                <Star className="stroke-muted-foreground mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Stars</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Stars</SelectItem>
                <SelectItem value="100">100+ Stars</SelectItem>
                <SelectItem value="500">500+ Stars</SelectItem>
                <SelectItem value="1000">1K+ Stars</SelectItem>
                <SelectItem value="5000">5K+ Stars</SelectItem>
                <SelectItem value="10000">10K+ Stars</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as [FilterOptions['sortBy'], FilterOptions['sortOrder']]
                handleFilterChange({ sortBy, sortOrder })
              }}
            >
              <SelectTrigger className="lg:px-4 lg:py-2 lg:w-auto rounded-lg min-w-32">
                <ArrowUpDown className="stroke-muted-foreground mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Sort</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars-desc">Most Stars</SelectItem>
                <SelectItem value="stars-asc">Least Stars</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="rounded-lg"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex gap-1.5 border-t bg-muted/40 py-2 -mx-4 md:-mx-6 px-4 md:px-6 items-center">
            <div className="flex items-center gap-1.5 border-r border-muted-foreground/30 pr-2 mr-1.5">
              <Filter className="stroke-muted-foreground/50 size-4" strokeWidth={1.5} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.search && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                  Search: "{filters.search}"
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                    onClick={() => handleFilterChange({ search: '' })}
                  />
                </div>
              )}
              {filters.categories && filters.categories.map(categorySlug => {
                const category = categories.find(c => c.slug === categorySlug)
                return category ? (
                  <div key={categorySlug} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                    {category.name}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-green-900" 
                      onClick={() => handleFilterChange({ 
                        categories: filters.categories!.filter(c => c !== categorySlug) 
                      })}
                    />
                  </div>
                ) : null
              })}
              {filters.minStars && filters.minStars > 0 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">
                  {filters.minStars}+ Stars
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-yellow-900" 
                    onClick={() => handleFilterChange({ minStars: 0 })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tools Summary */}
      {selectedTools.length > 0 && (
        <Card className="bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Selected Tools ({selectedTools.length})
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToolsSelect([])}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTools.map(tool => (
              <Badge 
                key={tool.id} 
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => handleToolToggle(tool)}
              >
                {tool.name} ×
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Tools Grid using DisplayCard */}
      {loading ? (
        <div className="grid gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-3">
                <Skeleton className="h-14 w-14 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTools.map(tool => {
            const isSelected = selectedTools.some(t => t.id === tool.id)
            
            return (
              <div 
                key={tool.id}
                className={cn(
                  "relative cursor-pointer transition-all",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => handleToolToggle(tool)}
              >
                <DisplayCard
                  name={tool.name}
                  description={tool.description}
                  license={tool.license}
                  isOpenSource={tool.isOpenSource}
                  githubStars={tool.githubStars}
                  features={tool.features.map(f => ({ 
                    name: f.feature.name, 
                    compatible: true,
                    featureType: f.feature.featureType 
                  }))}
                  repositoryUrl={tool.repositoryUrl}
                  websiteUrl={tool.websiteUrl}
                  simpleIconSlug={tool.simpleIconSlug}
                  simpleIconColor={tool.simpleIconColor}
                  totalFeatures={tool.features.length}
                  compatibilityScore={100} // All features are compatible for MIT tools
                  className={cn(
                    "transition-all hover:shadow-lg",
                    isSelected && "bg-primary/5 border-primary/20"
                  )}
                />
                
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <Checkbox 
                    checked={isSelected}
                    onChange={() => {}} // Handled by card click
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
                
                {/* Category Badge */}
                {tool.category && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-background/80 backdrop-blur"
                      style={{ 
                        borderColor: tool.category.color,
                        color: tool.category.color
                      }}
                    >
                      {tool.category.name}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tools found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Continue Button */}
      {selectedTools.length > 0 && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4 -mx-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedTools.length} tool{selectedTools.length === 1 ? '' : 's'} selected
            </div>
            <Button className="rounded-lg">
              Continue to Features →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}