'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronDown, Lightbulb } from 'lucide-react'
import { LogoIcon } from '@/features/dashboard/components/Logo'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface FilterState {
  categories: string[]
  licenses: string[]
  githubStars: string[]
  alternatives: string[]
  features: string[]
}

interface MobileFilterDropdownProps {
  selectedSoftware: string
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

export function MobileFilterDropdown({ selectedSoftware }: MobileFilterDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
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
  }, [filters, router, searchParams])

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

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.licenses.length > 0 || 
                          filters.githubStars.length > 0 ||
                          filters.alternatives.length > 0 ||
                          filters.features.length > 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="bg-muted/80 rounded-lg p-4 min-h-[60px] border border-border/50 ring-foreground/5 w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground mb-2">Filters</div>
              <div className="flex flex-wrap gap-2">
                {hasActiveFilters ? (
                  <>
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
                    {filters.categories.map(category => (
                      <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                        {category}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                          onClick={() => toggleArrayFilter('categories', category)}
                        />
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm italic">No filters applied</span>
                )}
              </div>
            </div>
            <button className="hover:bg-muted rounded p-1 transition-colors ml-4">
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )} />
            </button>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
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
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="pb-4 border-b border-border">
              <div className="text-xs text-muted-foreground mb-2">Active filters:</div>
              <div className="flex flex-wrap gap-1">
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
              </div>
            </div>
          )}

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
        </div>
      </PopoverContent>
    </Popover>
  )
}