'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronDown, Filter, Settings } from 'lucide-react'
import { LogoIcon } from '@/features/dashboard/components/Logo'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsMobile } from '@/components/ui/use-mobile'
import { cn } from '@/lib/utils'

export interface FilterState {
  categories: string[]
  licenses: string[]
  githubStars: string[]
  alternatives: string[]
  features: string[]
}

interface FilterSidebarProps {
  availableCategories?: Array<{ name: string; count: number }>
  selectedSoftware?: string
  proprietaryTools?: Array<{id: string, name: string, slug: string}>
  availableFeatures?: Array<{ name: string; count: number }>
}

const LICENSE_OPTIONS = [
  'MIT',
  'Apache 2.0', 
  'GPL v3',
  'BSD',
  'Custom (Commercial use allowed)',
  'Proprietary'
]

const GITHUB_STAR_RANGES = [
  { label: '< 1K', value: '0-1000' },
  { label: '1K - 5K', value: '1000-5000' },
  { label: '5K - 10K', value: '5000-10000' },
  { label: '> 10K', value: '10000+' }
]


export default function FilterSidebar({ availableCategories = [], selectedSoftware, proprietaryTools = [], availableFeatures = [] }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const licenses = searchParams.get('licenses')?.split(',').filter(Boolean) || []
    const githubStars = searchParams.get('stars')?.split(',').filter(Boolean) || []
    const alternatives = searchParams.get('alternatives')?.split(',').filter(Boolean) || []
    const features = searchParams.get('features')?.split(',').filter(Boolean) || []
    
    return { categories, licenses, githubStars, alternatives, features }
  })

  // Mobile collapse state
  const [isExpanded, setIsExpanded] = useState(false)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update URL params
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    } else {
      params.delete('categories')
    }
    
    if (filters.licenses.length > 0) {
      params.set('licenses', filters.licenses.join(','))
    } else {
      params.delete('licenses')
    }
    
    if (filters.githubStars.length > 0) {
      params.set('stars', filters.githubStars.join(','))
    } else {
      params.delete('stars')
    }
    
    if (filters.alternatives.length > 0) {
      params.set('alternatives', filters.alternatives.join(','))
    } else {
      params.delete('alternatives')
    }
    
    if (filters.features.length > 0) {
      params.set('features', filters.features.join(','))
    } else {
      params.delete('features')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/'
    router.push(newUrl, { scroll: false })
  }, [filters, router, searchParams])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'categories' | 'licenses' | 'githubStars' | 'alternatives' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      licenses: [],
      githubStars: [],
      alternatives: [],
      features: []
    })
  }

  const handleSoftwareChange = (software: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Find the tool slug for the selected software
    const selectedTool = proprietaryTools?.find(tool => tool.name === software)
    
    if (selectedTool) {
      // Remove any existing proprietaryTool filters
      Array.from(params.keys()).forEach(key => {
        if (key.startsWith('!proprietaryTool_')) {
          params.delete(key)
        }
      })
      
      // Add the new proprietaryTool filter using slug
      params.set('!proprietaryTool_slug', selectedTool.slug)
    }
    
    const newUrl = `?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.licenses.length > 0 || 
                          filters.githubStars.length > 0 ||
                          filters.alternatives.length > 0 ||
                          filters.features.length > 0

  return (
    <aside className="hidden md:block mb-8 md:mb-0 md:w-64 lg:w-72 md:ml-12 lg:ml-20 md:shrink-0 md:order-1">
      <div data-sticky="" data-margin-top="32" data-sticky-for="768" data-sticky-wrap="">
        <Card className="relative bg-card p-5">
          {/* Header with Clear Button */}
          <div className="flex items-center justify-between mb-6">
            {isMobile ? (
              <div className="w-full">
                <Select open={isExpanded} onOpenChange={setIsExpanded}>
                  <SelectTrigger
                    className="h-auto ps-2 text-left border-0 shadow-none [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_span]:shrink-0"
                  >
                    <SelectValue>
                      <span className="flex items-center gap-3">
                        <Settings 
                          className="w-6 h-6" 
                        />
                        <span>
                          <span className="block font-medium">Filters</span>
                          <span className="text-muted-foreground mt-0.5 block text-xs">
                            {hasActiveFilters ? `${filters.categories.length + filters.licenses.length + filters.githubStars.length + filters.alternatives.length + filters.features.length} active` : 'Tap to filter'}
                          </span>
                        </span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    <SelectItem value="filters" disabled>
                      <span className="text-muted-foreground text-sm">Filter options will appear here</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium mt-2"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium"
                  >
                    Clear all
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Filter Content */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isMobile ? (isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0") : "max-h-none opacity-100"
          )}>
            {/* Active Filters Display - Moved to Top */}
            {hasActiveFilters && (
              <div className="mb-6 pb-4 border-b border-border">
                <div className="text-xs text-muted-foreground mb-2">Active filters:</div>
                <div className="flex flex-wrap gap-1">
                  {filters.alternatives.map(alternative => (
                    <span key={alternative} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                      {alternative}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                        onClick={() => toggleArrayFilter('alternatives', alternative)}
                      />
                    </span>
                  ))}
                  {filters.categories.map(category => (
                    <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {category}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                        onClick={() => toggleArrayFilter('categories', category)}
                      />
                    </span>
                  ))}
                  {filters.licenses.map(license => (
                    <span key={license} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                      {license}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-green-900" 
                        onClick={() => toggleArrayFilter('licenses', license)}
                      />
                    </span>
                  ))}
                  {filters.githubStars.map(stars => (
                    <span key={stars} className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">
                      {GITHUB_STAR_RANGES.find(r => r.value === stars)?.label || stars}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-yellow-900" 
                        onClick={() => toggleArrayFilter('githubStars', stars)}
                      />
                    </span>
                  ))}
                  {filters.features.map(feature => (
                    <span key={feature} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                      {feature}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-orange-900" 
                        onClick={() => toggleArrayFilter('features', feature)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
            {/* Proprietary Software Select - Moved to top */}
            <div>
              <div className="text-sm text-foreground font-semibold mb-3">Alternatives to</div>
              <div className="text-xs text-muted-foreground mb-2">Currently showing alternatives to:</div>
              <Select value={selectedSoftware || ''} onValueChange={handleSoftwareChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select software..." />
                </SelectTrigger>
                <SelectContent>
                  {proprietaryTools?.map((tool) => (
                    <SelectItem key={tool.id} value={tool.name}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div>
              <div className="text-sm text-foreground font-semibold mb-3">Category</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableCategories.slice(0, 10).map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.name}`}
                      checked={filters.categories.includes(category.name)}
                      onCheckedChange={() => toggleArrayFilter('categories', category.name)}
                    />
                    <label 
                      htmlFor={`category-${category.name}`}
                      className="text-sm text-muted-foreground cursor-pointer flex-1 truncate"
                    >
                      {category.name} ({category.count})
                    </label>
                  </div>
                ))}
                {availableCategories.length > 10 && (
                  <div className="text-xs text-muted-foreground italic">
                    +{availableCategories.length - 10} more categories
                  </div>
                )}
              </div>
            </div>

            {/* License Type */}
            <div>
              <div className="text-sm text-foreground font-semibold mb-3">License Type</div>
              <div className="space-y-2">
                {LICENSE_OPTIONS.map((license) => (
                  <div key={license} className="flex items-center space-x-2">
                    <Checkbox
                      id={`license-${license}`}
                      checked={filters.licenses.includes(license)}
                      onCheckedChange={() => toggleArrayFilter('licenses', license)}
                    />
                    <label 
                      htmlFor={`license-${license}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {license}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Stars */}
            <div>
              <div className="text-sm text-foreground font-semibold mb-3">GitHub Stars</div>
              <div className="space-y-2">
                {GITHUB_STAR_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`stars-${range.value}`}
                      checked={filters.githubStars.includes(range.value)}
                      onCheckedChange={() => toggleArrayFilter('githubStars', range.value)}
                    />
                    <label 
                      htmlFor={`stars-${range.value}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {availableFeatures.length > 0 && (
              <div>
                <div className="text-sm text-foreground font-semibold mb-3">Features</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableFeatures.slice(0, 15).map((feature) => (
                    <div key={feature.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature.name}`}
                        checked={filters.features.includes(feature.name)}
                        onCheckedChange={() => toggleArrayFilter('features', feature.name)}
                      />
                      <label 
                        htmlFor={`feature-${feature.name}`}
                        className="text-sm text-muted-foreground cursor-pointer flex-1 truncate"
                      >
                        {feature.name} ({feature.count})
                      </label>
                    </div>
                  ))}
                  {availableFeatures.length > 15 && (
                    <div className="text-xs text-muted-foreground italic">
                      +{availableFeatures.length - 15} more features
                    </div>
                  )}
                </div>
              </div>
            )}

            </div>
          </div>
        </Card>
      </div>
    </aside>
  )
}