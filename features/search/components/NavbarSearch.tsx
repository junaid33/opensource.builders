'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Wrench, Package, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { request } from 'graphql-request'
import { MULTI_MODEL_SEARCH, type SearchResult } from '../queries/multiModelSearch'
import ToolIcon from '@/components/ToolIcon'
import debounce from 'lodash.debounce'

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults(null)
        return
      }

      setLoading(true)
      try {
        const data = await request<SearchResult>(
          '/api/graphql',
          MULTI_MODEL_SEARCH,
          { search: searchTerm }
        )
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    performSearch(search)
  }, [search, performSearch])

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleToolClick = (slug: string) => {
    router.push(`/tools/${slug}`)
    setIsOpen(false)
    setSearch('')
  }

  const handleFeatureClick = (slug: string) => {
    router.push(`/features/${slug}`)
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
      router.push(`/tools/${proprietaryTool.slug}#alternatives`)
    }
    
    setIsOpen(false)
    setSearch('')
  }

  const hasResults = results && (
    results.tools.length > 0 || 
    results.features.length > 0 || 
    results.alternatives.length > 0
  )

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search tools, features, or alternatives..."
          className={cn(
            "h-9 w-full pl-9 pr-3 text-sm",
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
              {/* Tools Section */}
              {results.tools.length > 0 && (
                <div className="mb-2">
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Tools
                  </div>
                  {results.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.slug)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        {tool.simpleIconSlug ? (
                          <ToolIcon
                            name={tool.name}
                            simpleIconSlug={tool.simpleIconSlug}
                            simpleIconColor={tool.simpleIconColor}
                            size={24}
                          />
                        ) : (
                          <Wrench className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{tool.name}</div>
                        {tool.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {tool.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tool.isOpenSource ? 'Open Source' : 'Proprietary'}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Features Section */}
              {results.features.length > 0 && (
                <div className="mb-2">
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Features
                  </div>
                  {results.features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureClick(feature.slug)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{feature.name}</div>
                        {feature.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {feature.description}
                          </div>
                        )}
                      </div>
                      {feature.featureType && (
                        <div className="text-xs text-muted-foreground">
                          {feature.featureType.replace('_', ' ')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Alternatives Section */}
              {results.alternatives.filter(alt => alt.openSourceTool && alt.proprietaryTool).length > 0 && (
                <div>
                  <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    Alternatives
                  </div>
                  {results.alternatives
                    .filter(alternative => alternative.openSourceTool && alternative.proprietaryTool)
                    .map((alternative) => (
                    <button
                      key={alternative.id}
                      onClick={() => handleAlternativeClick(alternative)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        {alternative.openSourceTool!.simpleIconSlug ? (
                          <ToolIcon
                            name={alternative.openSourceTool!.name}
                            simpleIconSlug={alternative.openSourceTool!.simpleIconSlug}
                            simpleIconColor={alternative.openSourceTool!.simpleIconColor}
                            size={24}
                          />
                        ) : (
                          <div 
                            className="flex aspect-square items-center justify-center rounded-md overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                            style={{ width: 24, height: 24 }}
                          >
                            {/* Noise texture overlay */}
                            <div
                              className="absolute inset-0 opacity-30"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            
                            {/* Letter */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className="font-silkscreen text-gray-100 select-none"
                                style={{ fontSize: 10 }}
                              >
                                {alternative.openSourceTool!.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Subtle highlight */}
                            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {alternative.openSourceTool!.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            alternative to
                          </span>
                          <span className="font-medium">
                            {alternative.proprietaryTool!.name}
                          </span>
                        </div>
                        
                        {/* Description */}
                        {alternative.openSourceTool!.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {alternative.openSourceTool!.description}
                          </div>
                        )}
                        
                        {/* Link indicator */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ExternalLink className="h-3 w-3" />
                            <span>
                              {alternative.openSourceTool!.repositoryUrl ? 'View Repository' : 
                               alternative.proprietaryTool!.websiteUrl ? 'Visit Website' : 'View Details'}
                            </span>
                          </div>
                          {alternative.similarityScore && (
                            <div className="text-xs text-muted-foreground">
                              {Math.round(alternative.similarityScore * 100)}% match
                            </div>
                          )}
                        </div>
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