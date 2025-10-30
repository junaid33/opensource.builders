'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useDebouncedSearch } from '../../lib/hooks/use-search'
import { SearchResult } from '../../types'
import ToolIcon from '@/components/ToolIcon'

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Use React Query for search
  const { data: results, isLoading: loading, error } = useDebouncedSearch(search, 300)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Log errors if they occur
  if (error) {
    console.error('Search error:', error)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleProprietaryToolClick = (slug: string) => {
    router.push(`/alternatives/${slug}`)
    setIsOpen(false)
    setSearch('')
  }

  const handleOpenSourceToolClick = (slug: string) => {
    router.push(`/os-alternatives/${slug}`)
    setIsOpen(false)
    setSearch('')
  }

  const handleCapabilityClick = (slug: string) => {
    router.push(`/capabilities/${slug}`)
    setIsOpen(false)
    setSearch('')
  }

  const handleAlternativeClick = (alternative: any) => {
    // For open source tools, link to repository; for proprietary, link to website
    const openSourceTool = alternative.openSourceTool
    const proprietaryTool = alternative.proprietaryTool
    
    if (openSourceTool?.repositoryUrl) {
      window.open(openSourceTool.repositoryUrl, '_blank')
    } else if (proprietaryTool?.websiteUrl) {
      window.open(proprietaryTool.websiteUrl, '_blank')
    } else {
      // Fallback to internal tool page
      router.push(`/alternatives/${proprietaryTool.slug}`)
    }
    
    setIsOpen(false)
    setSearch('')
  }

  const hasResults = results && (
    results.openSourceApplications.length > 0 || 
    results.proprietaryApplications.length > 0 || 
    results.capabilities.length > 0
  )

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search open source tools, proprietary apps, or capabilities..."
          className={cn(
            "h-9 w-full pl-9 pr-3 text-sm bg-background",
            isOpen && hasResults && "rounded-b-none"
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleInputFocus}
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && search.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-px max-h-96 overflow-auto rounded-b-md border border-t-0 bg-background shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : hasResults ? (
            <div className="p-2">
              {/* Open Source Applications */}
              {results.openSourceApplications.length > 0 && (
                <div className="mb-2">
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Open Source Applications
                  </div>
                  {results.openSourceApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleOpenSourceToolClick(app.slug)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <ToolIcon
                          name={app.name}
                          simpleIconSlug={app.simpleIconSlug}
                          simpleIconColor={app.simpleIconColor}
                          size={24}
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{app.name}</div>
                        {app.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {app.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Open Source
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Proprietary Applications */}
              {results.proprietaryApplications.length > 0 && (
                <div className="mb-2">
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Proprietary Applications
                  </div>
                  {results.proprietaryApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleProprietaryToolClick(app.slug)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <ToolIcon
                          name={app.name}
                          simpleIconSlug={app.simpleIconSlug}
                          simpleIconColor={app.simpleIconColor}
                          size={24}
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{app.name}</div>
                        {app.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {app.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Proprietary
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Capabilities Section */}
              {results.capabilities.length > 0 && (
                <div className="mb-2">
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Capabilities
                  </div>
                  {results.capabilities.map((capability) => (
                    <button
                      key={capability.id}
                      onClick={() => handleCapabilityClick(capability.slug)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{capability.name}</div>
                        {capability.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {capability.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {capability.complexity && (
                          <div className="text-xs text-muted-foreground">
                            {capability.complexity}
                          </div>
                        )}
                        {capability.category && capability.complexity && (
                          <div className="text-xs text-muted-foreground">·</div>
                        )}
                        {capability.category && (
                          <div className="text-xs text-muted-foreground">
                            {capability.category}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}