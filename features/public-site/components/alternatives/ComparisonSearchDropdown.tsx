'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import ToolIcon from '@/components/ToolIcon'
import { useDebouncedSearch } from '../../lib/hooks/use-search'

interface ComparisonSearchDropdownProps {
  currentApp: { slug: string; name: string; color?: string }
  otherAppSlug: string
  position: 'left' | 'right'
}

export function ComparisonSearchDropdown({ 
  currentApp,
  otherAppSlug,
  position
}: ComparisonSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOpenSource, setShowOpenSource] = useState(true)
  const [showProprietary, setShowProprietary] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { data: results, isLoading: loading, error } = useDebouncedSearch(searchTerm, 300)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleAppClick = (newSlug: string) => {
    if (newSlug === otherAppSlug) return;
    
    const slugs = position === 'left' 
      ? [newSlug, otherAppSlug] 
      : [otherAppSlug, newSlug];
    
    router.push(`/compare/${slugs.join('/')}`)
    setIsOpen(false)
    setSearchTerm('')
  }

  const toggleDropdown = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    
    if (newIsOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    } else {
      setSearchTerm('')
    }
  }

  const hasResults = results && (
    results.openSourceApplications.length > 0 || 
    results.proprietaryApplications.length > 0
  )

  return (
    <div ref={dropdownRef} className="relative inline-block ml-1">
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-md border border-transparent hover:border-border/60 transition-colors h-12 w-12 -mb-1"
        aria-label="Change application"
      >
        <svg 
          fill="currentColor" 
          width="218px" 
          height="218px" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg" 
          stroke="currentColor" 
          strokeWidth="2.75"
          className={cn(
            "h-10 w-10 transition-transform duration-200 text-muted-foreground",
            isOpen && "rotate-180"
          )}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="0.1"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" strokeWidth="2.75"></path>
          </g>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed top-auto left-auto mt-2 w-96 max-h-96 rounded-xl border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg z-[100] text-foreground overflow-hidden" style={{
          top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 'auto',
          left: dropdownRef.current ? (position === 'left' ? dropdownRef.current.getBoundingClientRect().left : dropdownRef.current.getBoundingClientRect().right - 384) : 'auto'
        }}>
          <div className="p-3">
            <div className="rounded-xl bg-muted border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Change application</h3>
              </div>

              {/* Filter toggles */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button
                  onClick={() => setShowOpenSource(!showOpenSource)}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-background border hover:bg-muted transition-all duration-200 shadow-sm"
                >
                  <div className={`inline-block size-2 shrink-0 rounded-full ${
                    showOpenSource 
                      ? 'bg-emerald-500 dark:bg-emerald-400 outline outline-2 -outline-offset-1 outline-emerald-200 dark:outline-emerald-900/50' 
                      : 'bg-rose-400 dark:bg-rose-400 outline outline-2 -outline-offset-1 outline-rose-200 dark:outline-rose-900/50'
                  }`} />
                  <span className="text-xs font-medium">Open Source</span>
                </button>
                <button
                  onClick={() => setShowProprietary(!showProprietary)}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-background border hover:bg-muted transition-all duration-200 shadow-sm"
                >
                  <div className={`inline-block size-2 shrink-0 rounded-full ${
                    showProprietary 
                      ? 'bg-emerald-500 dark:bg-emerald-400 outline outline-2 -outline-offset-1 outline-emerald-200 dark:outline-emerald-900/50' 
                      : 'bg-rose-400 dark:bg-rose-400 outline outline-2 -outline-offset-1 outline-rose-200 dark:outline-rose-900/50'
                  }`} />
                  <span className="text-xs font-medium">Proprietary</span>
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search application..."
                  className="h-9 w-full pl-9 pr-3 text-sm bg-background font-normal placeholder:font-normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-64 overflow-auto">
                {!searchTerm.trim() ? (
                  <div className="p-4 text-center text-sm text-muted-foreground font-normal">
                    Start typing to search for apps
                  </div>
                ) : loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : hasResults ? (
                  <div className="space-y-3">
                    {/* Open Source Applications */}
                    {showOpenSource && results.openSourceApplications.length > 0 && (
                      <div>
                        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                          Open Source
                        </div>
                        <div className="space-y-1">
                          {results.openSourceApplications
                            .filter(app => app.slug !== otherAppSlug && app.slug !== currentApp.slug)
                            .map((app) => (
                            <button
                              key={app.id}
                              onClick={() => handleAppClick(app.slug)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-background transition-colors"
                            >
                              <div className="flex h-7 w-7 items-center justify-center">
                                <ToolIcon
                                  name={app.name}
                                  simpleIconSlug={app.simpleIconSlug}
                                  simpleIconColor={app.simpleIconColor}
                                  size={20}
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
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proprietary Applications */}
                    {showProprietary && results.proprietaryApplications.length > 0 && (
                      <div>
                        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                          Proprietary
                        </div>
                        <div className="space-y-1">
                          {results.proprietaryApplications
                            .filter(app => app.slug !== otherAppSlug && app.slug !== currentApp.slug)
                            .map((app) => (
                            <button
                              key={app.id}
                              onClick={() => handleAppClick(app.slug)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-background transition-colors"
                            >
                              <div className="flex h-7 w-7 items-center justify-center">
                                <ToolIcon
                                  name={app.name}
                                  simpleIconSlug={app.simpleIconSlug}
                                  simpleIconColor={app.simpleIconColor}
                                  size={20}
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
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
