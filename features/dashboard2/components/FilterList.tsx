'use client'

import { useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { enhanceFields } from '../utils/enhanceFields'

interface FilterListProps {
  list: any
}

export function FilterList({ list }: FilterListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get enhanced fields using dashboard2's pattern
  const enhancedFields = useMemo(() => {
    return enhanceFields(list.fields, list.key)
  }, [list.fields, list.key])

  // Parse active filters from URL params
  const activeFilters = useMemo(() => {
    if (!searchParams) return []

    const filters: Array<{
      key: string
      fieldPath: string
      filterType: string
      value: any
      label: string
    }> = []

    searchParams.forEach((value, key) => {
      if (key.startsWith('!')) {
        const [fieldPath, filterType] = key.substring(1).split('_')
        const field = enhancedFields[fieldPath]
        
        if (field && field.controller?.filter) {
          try {
            const parsedValue = JSON.parse(value)
            const filterTypeConfig = field.controller.filter.types[filterType]
            
            if (filterTypeConfig) {
              // Use controller's Label function if available, otherwise create default label
              let label = `${field.label} ${filterTypeConfig.label.toLowerCase()}`
              
              if (field.controller.filter.Label) {
                label = field.controller.filter.Label({
                  label: field.label,
                  type: filterType,
                  value: parsedValue
                })
              } else {
                // Default label format
                if (typeof parsedValue === 'string' && parsedValue) {
                  label += ` "${parsedValue}"`
                } else if (typeof parsedValue !== 'string') {
                  label += ` ${parsedValue}`
                }
              }

              filters.push({
                key,
                fieldPath,
                filterType,
                value: parsedValue,
                label
              })
            }
          } catch (e) {
            // Skip invalid filter values
            console.warn('Invalid filter value for', key, ':', value)
          }
        }
      }
    })

    return filters
  }, [searchParams, enhancedFields])

  const removeFilter = (filterKey: string) => {
    if (!searchParams) return
    
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete(filterKey)
    newSearchParams.delete('page') // Reset to first page when filters change
    
    const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    router.push(`${pathname}${newUrl}`)
  }

  const clearAllFilters = () => {
    if (!searchParams) return
    
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    // Remove all filter parameters (those starting with '!')
    const keysToRemove: string[] = []
    newSearchParams.forEach((_, key) => {
      if (key.startsWith('!')) {
        keysToRemove.push(key)
      }
    })
    
    keysToRemove.forEach(key => newSearchParams.delete(key))
    newSearchParams.delete('page') // Reset to first page
    
    const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    router.push(`${pathname}${newUrl}`)
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="px-4 md:px-6 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filters:</span>
        {activeFilters.map((filter) => (
          <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
            {filter.label}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => removeFilter(filter.key)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        ))}
        {activeFilters.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}