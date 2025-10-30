'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import ToolIcon from '@/components/ToolIcon'
import { useAllProprietaryApps } from '../../lib/hooks/use-all-proprietary-apps'
import debounce from 'lodash.debounce'

interface ProprietaryApp {
  id: string
  name: string
  slug: string
  description: string | null
  websiteUrl: string | null
  simpleIconSlug: string | null
  simpleIconColor: string | null
  openSourceAlternativesCount: number
}

interface ProprietaryAppsDropdownProps {
  currentSlug?: string
  currentName: string
  iconColor?: string
}

export function ProprietaryAppsDropdown({ 
  currentSlug, 
  currentName,
  iconColor 
}: ProprietaryAppsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredApps, setFilteredApps] = useState<ProprietaryApp[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { data: apps = [] } = useAllProprietaryApps()

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

  // Debounced search function
  const performSearch = useCallback(
    debounce((search: string, allApps: ProprietaryApp[]) => {
      if (!search.trim()) {
        // Filter out current app from all apps when no search term
        setFilteredApps(allApps.filter(app => app.slug !== currentSlug))
        return
      }

      // Filter apps based on search term and exclude current app
      const filtered = allApps
        .filter(app => app.slug !== currentSlug)
        .filter(app => 
          app.name.toLowerCase().includes(search.toLowerCase()) ||
          (app.description && app.description.toLowerCase().includes(search.toLowerCase()))
        )
      
      setFilteredApps(filtered)
    }, 300),
    [currentSlug]
  )

  // Update filtered apps when search term or apps change
  useEffect(() => {
    performSearch(searchTerm, apps)
  }, [searchTerm, apps, performSearch])

  const handleAppClick = (slug: string) => {
    router.push(`/alternatives/${slug}`)
    setIsOpen(false)
    setSearchTerm('')
  }

  const toggleDropdown = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    
    // Focus search input when dropdown opens
    if (newIsOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    } else {
      setSearchTerm('')
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-md border border-transparent hover:border-border/60 transition-colors h-12 w-12 -mb-1"
        aria-label="Switch to other proprietary app"
      >
        <ChevronDown 
          className={cn(
            "h-7 w-7 transition-transform duration-200 stroke-2 align-baseline",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-auto left-auto mt-2 w-80 max-h-96 rounded-lg border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg z-[100] text-foreground" style={{
          top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 'auto',
          left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 'auto'
        }}>
          <div className="p-2">
            <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Switch to other app
            </div>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search proprietary apps..."
                className="h-9 w-full pl-9 pr-3 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-auto">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app.slug)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  >
                    <div className="flex h-8 w-8 items-center justify-center">
                      {app.simpleIconSlug ? (
                        <ToolIcon
                          name={app.name}
                          simpleIconSlug={app.simpleIconSlug}
                          simpleIconColor={app.simpleIconColor || undefined}
                          size={24}
                        />
                      ) : (
                        <div 
                          className="flex aspect-square items-center justify-center rounded-md overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                          style={{ width: 24, height: 24 }}
                        >
                          <span
                            className="font-semibold text-gray-100 select-none"
                            style={{ fontSize: 10 }}
                          >
                            {app.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium">{app.name}</div>
                      {app.description && (
                        <div className="truncate text-xs text-muted-foreground">
                          {app.description}
                        </div>
                      )}
                    </div>
                    {app.openSourceAlternativesCount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {app.openSourceAlternativesCount} alternatives
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchTerm.trim() 
                    ? `No results found for "${searchTerm}"` 
                    : "No other apps available"
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}