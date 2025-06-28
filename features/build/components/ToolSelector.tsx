'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Star, ExternalLink, Github, Filter, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ToolIcon } from '@/components/ToolIcon'
// Note: Using server-side data passed as props instead of client-side fetching
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
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search MIT open source tools..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex-1 min-w-48">
            <Select
              value={filters.categories?.join(',') || 'all'}
              onValueChange={(value) => 
                handleFilterChange({ 
                  categories: value === 'all' ? [] : value.split(',')
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
          </div>

          {/* Minimum Stars Filter */}
          <div className="min-w-32">
            <Select
              value={filters.minStars?.toString() || '0'}
              onValueChange={(value) => 
                handleFilterChange({ minStars: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Min Stars" />
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
          </div>

          {/* Sort */}
          <div className="min-w-32">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as [FilterOptions['sortBy'], FilterOptions['sortOrder']]
                handleFilterChange({ sortBy, sortOrder })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars-desc">Most Stars</SelectItem>
                <SelectItem value="stars-asc">Least Stars</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="updated-desc">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Selected Tools Summary */}
      {selectedTools.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              Selected Tools ({selectedTools.length})
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToolsSelect([])}
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTools.map(tool => (
              <Badge 
                key={tool.id} 
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleToolToggle(tool)}
              >
                {tool.name} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => {
            const isSelected = selectedTools.some(t => t.id === tool.id)
            
            return (
              <Card 
                key={tool.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handleToolToggle(tool)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <ToolIcon
                        tool={{ 
                          simpleIconSlug: tool.simpleIconSlug,
                          simpleIconColor: tool.simpleIconColor,
                          name: tool.name
                        }}
                        size="md"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {tool.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {tool.githubStars && tool.githubStars > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              {tool.githubStars.toLocaleString()}
                            </div>
                          )}
                          {tool.category && (
                            <Badge variant="outline" className="text-xs">
                              {tool.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => {}} // Handled by card click
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3 line-clamp-3">
                    {tool.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        MIT License
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tool.features.length} features
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {tool.websiteUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(tool.websiteUrl, '_blank')
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      {tool.repositoryUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(tool.repositoryUrl, '_blank')
                          }}
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4 -mx-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedTools.length} tool{selectedTools.length === 1 ? '' : 's'} selected
            </div>
            <Button>
              Continue to Features →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}