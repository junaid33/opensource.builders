'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  proprietaryTools?: string[]
  availableFeatures?: Array<{ name: string; count: number }>
  onFiltersChange?: (filters: FilterState) => void
  onSoftwareChange?: (software: string) => void
  onFeatureClick?: (feature: string) => void
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


export default function FilterSidebar({ availableCategories = [], selectedSoftware, proprietaryTools = [], availableFeatures = [], onFiltersChange, onSoftwareChange, onFeatureClick }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const licenses = searchParams.get('licenses')?.split(',').filter(Boolean) || []
    const githubStars = searchParams.get('stars')?.split(',').filter(Boolean) || []
    const alternatives = searchParams.get('alternatives')?.split(',').filter(Boolean) || []
    const features = searchParams.get('features')?.split(',').filter(Boolean) || []
    
    return { categories, licenses, githubStars, alternatives, features }
  })

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
    
    // Notify parent component
    onFiltersChange?.(filters)
  }, [filters, router, searchParams, onFiltersChange])

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
    params.set('software', software)
    const newUrl = `?${params.toString()}`
    router.push(newUrl, { scroll: false })
    onSoftwareChange?.(software)
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.licenses.length > 0 || 
                          filters.githubStars.length > 0 ||
                          filters.alternatives.length > 0 ||
                          filters.features.length > 0

  return (
    <aside className="mb-8 md:mb-0 md:w-64 lg:w-72 md:ml-12 lg:ml-20 md:shrink-0 md:order-1">
      <div data-sticky="" data-margin-top="32" data-sticky-for="768" data-sticky-wrap="">
        <Card className="relative bg-gray-50 p-5">
          {/* Header with Clear Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 h-auto p-0 text-sm font-medium"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Active Filters Display - Moved to Top */}
          {hasActiveFilters && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Active filters:</div>
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
              <div className="text-sm text-gray-800 font-semibold mb-3">Alternatives to</div>
              <div className="text-xs text-gray-500 mb-2">Currently showing alternatives to:</div>
              <Select value={selectedSoftware || ''} onValueChange={handleSoftwareChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select software..." />
                </SelectTrigger>
                <SelectContent>
                  {proprietaryTools.map((software) => (
                    <SelectItem key={software} value={software}>
                      {software}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">Category</div>
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
                      className="text-sm text-gray-600 cursor-pointer flex-1 truncate"
                    >
                      {category.name} ({category.count})
                    </label>
                  </div>
                ))}
                {availableCategories.length > 10 && (
                  <div className="text-xs text-gray-500 italic">
                    +{availableCategories.length - 10} more categories
                  </div>
                )}
              </div>
            </div>

            {/* License Type */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">License Type</div>
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
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {license}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Stars */}
            <div>
              <div className="text-sm text-gray-800 font-semibold mb-3">GitHub Stars</div>
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
                      className="text-sm text-gray-600 cursor-pointer"
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
                <div className="text-sm text-gray-800 font-semibold mb-3">Features</div>
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
                        className="text-sm text-gray-600 cursor-pointer flex-1 truncate"
                      >
                        {feature.name} ({feature.count})
                      </label>
                    </div>
                  ))}
                  {availableFeatures.length > 15 && (
                    <div className="text-xs text-gray-500 italic">
                      +{availableFeatures.length - 15} more features
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </Card>
      </div>
    </aside>
  )
}