'use client'

import { useState, useId, useEffect, useRef, useCallback } from 'react'
import { Search, Package, ExternalLink, X, Check, ChevronDown, Lightbulb, Nut, HelpCircle, Github, Copy, CheckCircle, Sparkles } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { LogoIcon } from '@/features/dashboard/components/Logo'
import { DisplayCard } from '@/features/landing/components/display-card'
import { MiniDonutChart } from '@/components/ui/mini-donut-chart'
import { request } from 'graphql-request'
import ToolIcon from '@/components/ToolIcon'
import debounce from 'lodash.debounce'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

// Enhanced search query to get tools with their features
const MULTI_MODEL_SEARCH = `
  query MultiModelSearch($search: String!) {
    tools(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 8
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      isOpenSource
      simpleIconSlug
      simpleIconColor
      repositoryUrl
      features {
        feature {
          id
          name
          slug
          description
          featureType
        }
        qualityScore
        implementationNotes
        verified
      }
    }
    
    alternatives(
      where: {
        OR: [
          { comparisonNotes: { contains: $search, mode: insensitive } }
          { proprietaryTool: { 
            OR: [
              { name: { contains: $search, mode: insensitive } }
              { slug: { contains: $search, mode: insensitive } }
            ]
          }}
          { openSourceTool: { 
            OR: [
              { name: { contains: $search, mode: insensitive } }
              { slug: { contains: $search, mode: insensitive } }
            ]
          }}
        ]
      }
      take: 5
      orderBy: { similarityScore: desc }
    ) {
      id
      comparisonNotes
      similarityScore
      proprietaryTool {
        id
        name
        slug
        simpleIconSlug
        simpleIconColor
        websiteUrl
      }
      openSourceTool {
        id
        name
        slug
        description
        simpleIconSlug
        simpleIconColor
        websiteUrl
        repositoryUrl
        features {
          feature {
            id
            name
            slug
            description
            featureType
          }
          qualityScore
          implementationNotes
          verified
        }
      }
    }
  }
`

interface SearchResult {
  tools: {
    id: string
    name: string
    slug: string
    description?: string
    isOpenSource: boolean
    simpleIconSlug?: string
    simpleIconColor?: string
    repositoryUrl?: string
    features: {
      feature: {
        id: string
        name: string
        slug: string
        description?: string
        featureType?: string
      }
      qualityScore?: number
      implementationNotes?: string
      verified?: boolean
    }[]
  }[]
  alternatives: {
    id: string
    comparisonNotes?: string
    similarityScore?: number
    proprietaryTool: {
      id: string
      name: string
      slug: string
      simpleIconSlug?: string
      simpleIconColor?: string
      websiteUrl?: string
    } | null
    openSourceTool: {
      id: string
      name: string
      slug: string
      description?: string
      simpleIconSlug?: string
      simpleIconColor?: string
      websiteUrl?: string
      repositoryUrl?: string
      features: {
        feature: {
          id: string
          name: string
          slug: string
          description?: string
          featureType?: string
        }
        qualityScore?: number
        implementationNotes?: string
        verified?: boolean
      }[]
    } | null
  }[]
}


interface SelectedFeature {
  id: string // This will be toolId-featureId composite key
  featureId: string // Original feature ID
  toolId: string // Tool ID
  name: string
  description?: string
  featureType?: string
  toolName: string
  toolIcon?: string
  toolColor?: string
  toolRepo?: string // Repository URL
  isOpenSource?: boolean // Whether the tool is open source
}

const starterTemplates = [
  {
    id: '1',
    name: 'Next.js + Keystone Starter',
    description: 'Full-stack template with admin'
  },
  {
    id: 'byos',
    name: 'Bring Your Own Starter',
    description: 'Start with what you have'
  }
]


interface PromptBuilderProps {
  onPromptChange?: (prompt: string) => void
  className?: string
}

export function PromptBuilder({ onPromptChange, className }: PromptBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>([])
  const [expandedChips, setExpandedChips] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const selectId = useId()

  // Search state (copied from NavbarSearch)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleFeatureSelect = (feature: any, toolId: string, toolName: string, toolIcon?: string, toolColor?: string, toolRepo?: string, isOpenSource?: boolean) => {
    const compositeId = `${toolId}-${feature.id}`
    const selectedFeature: SelectedFeature = {
      id: compositeId,
      featureId: feature.id,
      toolId: toolId,
      name: feature.name,
      description: feature.description,
      featureType: feature.featureType,
      toolName,
      toolIcon,
      toolColor,
      toolRepo,
      isOpenSource
    }

    setSelectedFeatures(prev => {
      const isAlreadySelected = prev.some(f => f.id === compositeId)
      if (isAlreadySelected) {
        return prev.filter(f => f.id !== compositeId)
      } else {
        return [...prev, selectedFeature]
      }
    })
    
    // Keep dropdown open and search term for multi-selection
    // setIsOpen(false)
    // setSearch('')
  }

  const handleFeatureRemove = (featureId: string) => {
    setSelectedFeatures(prev => prev.filter(f => f.id !== featureId))
  }

  const toggleChipExpansion = (chipId: string) => {
    setExpandedChips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chipId)) {
        newSet.delete(chipId)
      } else {
        newSet.add(chipId)
      }
      return newSet
    })
  }

  const getTemplatePromptText = (templateId: string) => {
    // In a real app, this would come from a database or config
    const templatePrompts: Record<string, string> = {
      '1': `Create a new repository using the Next.js + Keystone.js starter template:

1. Run: gh repo create my-project --template junaid33/next-keystone-starter --clone
2. Run: npm install && npm run dev
3. READ these documentation files to understand the architecture:
   - docs/ARCHITECTURE.md (overall system design)
   - docs/KEYSTONE-INTEGRATION.md (how Keystone.js integrates with Next.js)
   - docs/DASHBOARD-SYSTEM.md (custom admin dashboard architecture)
4. Reference https://keystonejs.com/docs for Keystone-specific implementation details

This starter combines Next.js (App Router) with Keystone.js as a headless CMS, featuring a custom admin dashboard built with Tailwind CSS and shadcn/ui. Before implementing any features, read the relevant documentation files to understand existing patterns and architecture.`,
      'byos': '' // No template setup for "bring your own starter"
    }
    return templatePrompts[templateId] || 'Use the selected starter template'
  }

  const getFeaturePromptText = (feature: SelectedFeature) => {
    if (feature.isOpenSource) {
      // Open source tools - access their code directly
      const repoUrl = feature.toolRepo || `https://github.com/search?q=${feature.toolName.toLowerCase()}`
      
      return `Implement ${feature.toolName}'s ${feature.name}. 

${feature.toolName} repository: ${repoUrl}

Use GitHub MCP (if available) or GitHub to find the relevant code that implements ${feature.name} and adapt it to our Next.js + Keystone.js infrastructure. Follow our existing patterns in /features/ directory and integrate with the Keystone schema.`
    } else {
      // Proprietary tools - use web search to understand the feature
      return `Implement ${feature.toolName}'s ${feature.name}.

Use web search to research ${feature.toolName} and learn more about what flow this feature allows and how to implement it in our starter. Study their documentation, API references, and best practices, then create a similar implementation that integrates with our Next.js + Keystone.js infrastructure.`
    }
  }

  const getTemplateNutshell = (templateId: string) => {
    const nutshells: Record<string, string> = {
      '1': 'Explains to the AI that the Next.js + Keystone starter is a Next.js app with GraphQL API from Keystone.js and custom admin dashboard.',
      'byos': 'No starter template setup - you will work with your existing codebase and integrate the selected features into your current architecture.'
    }
    return nutshells[templateId] || 'Starter template setup instructions'
  }

  const getFeatureNutshell = (feature: SelectedFeature) => {
    if (feature.isOpenSource) {
      return `Tells AI to examine ${feature.toolName}'s repository code for ${feature.name} and adapt it to our infrastructure.`
    } else {
      return `Tells AI to research ${feature.toolName}'s docs via web search and implement ${feature.name} in our starter.`
    }
  }

  const generatePrompt = () => {
    // For BYOS, only show features (no template)
    if (selectedTemplate === 'byos') {
      if (selectedFeatures.length === 0) return ''
      
      let prompt = 'Implement the following features in your existing codebase:\n\n'
      selectedFeatures.forEach((feature, index) => {
        prompt += `${index + 1}. ${getFeaturePromptText(feature)}\n\n`
      })
      prompt += 'Analyze your existing codebase architecture and integrate these features following your current patterns and conventions. Provide detailed step-by-step instructions that work with your specific tech stack.'
      
      return prompt.trim()
    }
    
    // For regular templates
    if (!selectedTemplate && selectedFeatures.length === 0) return ''
    
    let prompt = ''
    
    // Add template prompt
    if (selectedTemplate && selectedTemplate !== 'none') {
      prompt += getTemplatePromptText(selectedTemplate) + '\n\n'
    }
    
    // Add feature prompts
    if (selectedFeatures.length > 0) {
      prompt += 'Implement the following features:\n\n'
      selectedFeatures.forEach((feature, index) => {
        prompt += `${index + 1}. ${getFeaturePromptText(feature)}\n\n`
      })
    }
    
    // Add closing instructions
    prompt += 'Ensure all implementations follow best practices, are properly tested, and integrate seamlessly with the existing codebase. Provide detailed step-by-step instructions for each feature implementation.'
    
    return prompt.trim()
  }


  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
  }

  const handleCopyPrompt = async () => {
    const prompt = generatePrompt()
    if (!prompt) return
    
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  // Update prompt when features change
  useEffect(() => {
    const newPrompt = generatePrompt()
    onPromptChange?.(newPrompt)
  }, [selectedFeatures])

  const hasResults = results && (
    results.tools.length > 0 || 
    results.alternatives.length > 0
  )

  // Group features by tool for display
  const groupedSelectedFeatures = selectedFeatures.reduce((acc, feature) => {
    if (!acc[feature.toolName]) {
      acc[feature.toolName] = {
        toolName: feature.toolName,
        toolIcon: feature.toolIcon,
        toolColor: feature.toolColor,
        features: []
      }
    }
    acc[feature.toolName].features.push(feature)
    return acc
  }, {} as Record<string, { toolName: string, toolIcon?: string, toolColor?: string, features: SelectedFeature[] }>)

  return (
    <TooltipProvider>
      <section className={cn("py-8", className)}>
        <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 border border-border mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="text-sm font-medium">Extract proven features from open source</span>
          </div>
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">AI-Powered Feature Builder</h2>
          <p className="text-muted-foreground mt-4 text-balance max-w-lg mx-auto">
            Cherry-pick powerful features from Cal.com, Supabase, Medusa and more. We'll generate the perfect AI prompt to implement them in your project.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="bg-card w-full rounded-2xl border px-8 py-6 shadow-sm space-y-6">
            {/* Starter Template Selection */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Starter</p>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange} defaultValue="1">
                <SelectTrigger
                  className="h-auto ps-2 text-left border-0 shadow-none [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_span]:shrink-0"
                >
                  <SelectValue placeholder="Choose a starter template" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  {starterTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <span className="flex items-center gap-3">
                        <LogoIcon 
                          className={cn(
                            "w-6 h-6",
                            template.id === 'byos' ? "text-emerald-500" : ""
                          )} 
                        />
                        <span>
                          <span className="block font-medium">{template.name}</span>
                          <span className="text-muted-foreground mt-0.5 block text-xs">
                            {template.description}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value="none" disabled>
                    <span className="text-muted-foreground text-sm">No other options</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Source and Info links below the select */}
              {selectedTemplate && selectedTemplate !== 'none' && (
                <div className="flex items-center gap-1 ml-2 mt-2">
                  {selectedTemplate !== 'byos' && (
                    <>
                      <a
                        href="https://github.com/junaid33/next-keystone-starter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Source
                      </a>
                      <span className="text-muted-foreground text-xs">·</span>
                    </>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Info
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-80">
                      <div className="space-y-2">
                        <p className="text-sm text-foreground">
                          {selectedTemplate === 'byos' 
                            ? 'Use your existing codebase as the foundation. Perfect for integrating powerful features from open source tools into your current project without starting from scratch.'
                            : 'The ultimate starter comes with a dashboard, GraphQL API, authentication, all built into one Next.js application, powers Open Source Builders, Openfront, Openship, and many more.'
                          }
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Dash Separator */}
            <div className="border-t border-dashed border-border my-6"></div>

            {/* Features Search */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Features</p>
              
              {/* Selected Features Summary - showing all tools */}
              {selectedFeatures.length > 0 && (
                <div className="border-0 shadow-none space-y-3">
                  {Object.values(groupedSelectedFeatures).map((toolGroup) => (
                    <div key={toolGroup.toolName} className="h-auto ps-2 text-left flex items-center gap-2">
                      <div className="flex items-center gap-3">
                        <ToolIcon
                          name={toolGroup.toolName}
                          simpleIconSlug={toolGroup.toolIcon}
                          simpleIconColor={toolGroup.toolColor}
                          size={24}
                        />
                        <div>
                          <div className="block font-medium">
                            {toolGroup.toolName}
                          </div>
                          <div className="text-muted-foreground mt-0.5 block text-xs">
                            {toolGroup.features.length === 1 
                              ? toolGroup.features[0].name
                              : `${toolGroup.features.length} features selected`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <MiniDonutChart
                                value={toolGroup.features.length}
                                total={Math.max(toolGroup.features.length, 5)}
                                size={20}
                                strokeWidth={3}
                                className="text-primary"
                              />
                              <span className="text-xs text-muted-foreground">
                                {toolGroup.features.length}/{Math.max(toolGroup.features.length, 5)}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-80">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 pb-2 border-b">
                                <ToolIcon
                                  name={toolGroup.toolName}
                                  simpleIconSlug={toolGroup.toolIcon}
                                  simpleIconColor={toolGroup.toolColor}
                                  size={20}
                                />
                                <h4 className="font-medium">{toolGroup.toolName} Features</h4>
                              </div>
                              <div className="space-y-1 max-h-64 overflow-y-auto">
                                {toolGroup.features.map((feature) => (
                                  <button
                                    key={feature.id}
                                    onClick={() => handleFeatureRemove(feature.id)}
                                    className="w-full flex items-start gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent transition-colors"
                                  >
                                    <div className="flex h-4 w-4 items-center justify-center rounded border border-primary bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                                      <Check className="h-2.5 w-2.5" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">{feature.name}</div>
                                      {feature.description && (
                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                          {feature.description}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="pt-2 border-t text-xs text-muted-foreground">
                                Click any feature to remove it
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Search Component (copied from NavbarSearch) */}
              <div ref={searchRef} className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search features from open source tools..."
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
                  <div className="absolute top-full left-0 right-0 z-50 mt-px max-h-96 overflow-y-auto rounded-b-md border border-t-0 bg-background shadow-lg">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : hasResults ? (
                      <div>
                        {/* Header with multi-selection hint and close button */}
                        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/10">
                          <div className="text-xs text-muted-foreground">
                            Click features to select • Click again to deselect
                          </div>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-2">
                          {/* Tools with their Features */}
                        {results.tools.map((tool) => (
                          <div key={tool.id} className="mb-4">
                            {/* Tool Header (non-clickable) */}
                            <div className="mb-2 px-2 py-2 rounded-md bg-muted/20">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <ToolIcon
                                  name={tool.name}
                                  simpleIconSlug={tool.simpleIconSlug}
                                  simpleIconColor={tool.simpleIconColor}
                                  size={20}
                                />
                                {tool.name}
                              </div>
                              {tool.description && (
                                <div className="text-xs text-muted-foreground mt-1 ml-7">
                                  {tool.description}
                                </div>
                              )}
                            </div>
                            
                            {/* Features from this tool */}
                            {tool.features && tool.features.length > 0 && (
                              <div className="ml-4 space-y-1">
                                {tool.features
                                  .filter(toolFeature => toolFeature.feature !== null)
                                  .map((toolFeature, index) => (
                                  <button
                                    key={`tool-${tool.id}-feature-${toolFeature.feature.id}-${index}`}
                                    onClick={() => handleFeatureSelect(toolFeature.feature, tool.id, tool.name, tool.simpleIconSlug, tool.simpleIconColor, tool.repositoryUrl, tool.isOpenSource)}
                                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center">
                                      {selectedFeatures.some(f => f.id === `${tool.id}-${toolFeature.feature.id}`) ? (
                                        <div className="text-green-500 text-sm">✓</div>
                                      ) : (
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <div className="font-medium">{toolFeature.feature.name}</div>
                                      {toolFeature.feature.description && (
                                        <div className="truncate text-xs text-muted-foreground">
                                          {toolFeature.feature.description}
                                        </div>
                                      )}
                                    </div>
                                    {toolFeature.feature.featureType && (
                                      <div className="text-xs text-muted-foreground">
                                        {toolFeature.feature.featureType.replace('_', ' ')}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Open Source Alternatives with Features */}
                        {results.alternatives
                          .filter(alt => alt.openSourceTool && alt.proprietaryTool)
                          .map((alternative) => (
                            <div key={alternative.id} className="mb-4">
                              {/* Alternative Tool Header */}
                              <div className="mb-2 px-2 py-2 rounded-md bg-muted/20">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <ToolIcon
                                    name={alternative.openSourceTool!.name}
                                    simpleIconSlug={alternative.openSourceTool!.simpleIconSlug}
                                    simpleIconColor={alternative.openSourceTool!.simpleIconColor}
                                    size={20}
                                  />
                                  <span>{alternative.openSourceTool!.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    alternative to {alternative.proprietaryTool!.name}
                                  </span>
                                </div>
                                {alternative.openSourceTool!.description && (
                                  <div className="text-xs text-muted-foreground mt-1 ml-7">
                                    {alternative.openSourceTool!.description}
                                  </div>
                                )}
                              </div>

                              {/* Features from this alternative tool */}
                              {alternative.openSourceTool!.features && alternative.openSourceTool!.features.length > 0 && (
                                <div className="ml-4 space-y-1">
                                  {alternative.openSourceTool!.features
                                    .filter(toolFeature => toolFeature.feature !== null)
                                    .map((toolFeature, index) => (
                                    <button
                                      key={`alt-${alternative.id}-tool-${alternative.openSourceTool!.id}-feature-${toolFeature.feature.id}-${index}`}
                                      onClick={() => handleFeatureSelect(
                                        toolFeature.feature, 
                                        alternative.openSourceTool!.id,
                                        alternative.openSourceTool!.name, 
                                        alternative.openSourceTool!.simpleIconSlug, 
                                        alternative.openSourceTool!.simpleIconColor,
                                        alternative.openSourceTool!.repositoryUrl,
                                        alternative.openSourceTool!.isOpenSource
                                      )}
                                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                                    >
                                      <div className="flex h-6 w-6 items-center justify-center">
                                        {selectedFeatures.some(f => f.id === `${alternative.openSourceTool!.id}-${toolFeature.feature.id}`) ? (
                                          <div className="text-green-500 text-sm">✓</div>
                                        ) : (
                                          <Package className="h-4 w-4 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                        <div className="font-medium">{toolFeature.feature.name}</div>
                                        {toolFeature.feature.description && (
                                          <div className="truncate text-xs text-muted-foreground">
                                            {toolFeature.feature.description}
                                          </div>
                                        )}
                                      </div>
                                      {toolFeature.feature.featureType && (
                                        <div className="text-xs text-muted-foreground">
                                          {toolFeature.feature.featureType.replace('_', ' ')}
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No results found for "{search}"
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Dash Separator */}
            <div className="border-t border-dashed border-border my-6"></div>

            {/* Prompt Section */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Prompt</p>
              
              {/* Gray container with chips */}
              <div className="bg-muted/30 rounded-lg p-4 min-h-[120px] border border-border/50 shadow-inner">
                <div className="space-y-2">
                  {/* Generate chips based on selections */}
                  {(() => {
                    const chips = []
                    
                    // Add starter template chip (but not for "bring your own starter")
                    if (selectedTemplate && selectedTemplate !== 'none' && selectedTemplate !== 'byos') {
                      const template = starterTemplates.find(t => t.id === selectedTemplate)
                      if (template) {
                        const chipId = `template-${selectedTemplate}`
                        const isExpanded = expandedChips.has(chipId)
                        chips.push(
                          <div key="starter" className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm text-sm font-medium">
                              <button
                                onClick={() => setSelectedTemplate('')}
                                className="hover:bg-muted rounded p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3 text-muted-foreground" />
                              </button>
                              <LogoIcon 
                                className={cn(
                                  "w-4 h-4",
                                  selectedTemplate === 'byos' ? "text-emerald-500" : ""
                                )} 
                              />
                              <span>Use {template.name}</span>
                              <div className="ml-auto flex items-center gap-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="hover:bg-muted rounded p-1 transition-colors">
                                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent side="top" className="w-80">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Nut className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm font-medium">In a nutshell</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{getTemplateNutshell(selectedTemplate)}</p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                <button
                                  onClick={() => toggleChipExpansion(chipId)}
                                  className="hover:bg-muted rounded p-1 transition-colors"
                                >
                                  <ChevronDown className={cn(
                                    "h-4 w-4 text-muted-foreground transition-transform",
                                    isExpanded && "rotate-180"
                                  )} />
                                </button>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="ml-8 p-3 rounded-lg bg-background backdrop-blur-sm border border-border/50 shadow-sm text-xs text-muted-foreground">
                                {getTemplatePromptText(selectedTemplate)}
                              </div>
                            )}
                          </div>
                        )
                      }
                    }

                    // Add feature chips
                    selectedFeatures.forEach((feature) => {
                      const chipId = `feature-${feature.id}`
                      const isExpanded = expandedChips.has(chipId)
                      chips.push(
                        <div key={feature.id} className="space-y-2">
                          <div className="inline-flex items-center gap-2 px-2 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm text-sm">
                            <button
                              onClick={() => handleFeatureRemove(feature.id)}
                              className="hover:bg-muted rounded p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                            <ToolIcon
                              name={feature.toolName}
                              simpleIconSlug={feature.toolIcon}
                              simpleIconColor={feature.toolColor}
                              size={16}
                            />
                            <span>Add {feature.name} from {feature.toolName}</span>
                            <div className="ml-auto flex items-center gap-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="hover:bg-muted rounded p-1 transition-colors">
                                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent side="top" className="w-80">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Nut className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-sm font-medium">In a nutshell</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{getFeatureNutshell(feature)}</p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <button
                                onClick={() => toggleChipExpansion(chipId)}
                                className="hover:bg-muted rounded p-1 transition-colors"
                              >
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-muted-foreground transition-transform",
                                  isExpanded && "rotate-180"
                                )} />
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="ml-8 p-3 rounded-lg bg-background backdrop-blur-sm border border-border/50 shadow-sm text-xs text-muted-foreground">
                              {getFeaturePromptText(feature)}
                            </div>
                          )}
                        </div>
                      )
                    })

                    return chips.length > 0 ? chips : (
                      <div className="text-muted-foreground text-sm italic">
                        Select a starter template and features to see your AI prompt...
                      </div>
                    )
                  })()}
                </div>
              </div>
              
              {/* Copy Prompt Button */}
              {generatePrompt() && (
                <div className="flex flex-col gap-4 mt-6">
                  <Button
                    onClick={handleCopyPrompt}
                    className="h-10"
                    // className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                  
                  {/* Call to action for submissions */}
                  {selectedTemplate !== 'byos' && (
                    <div className="flex flex-col text-center p-4 rounded-lg bg-muted/30 border border-border/50 backdrop-blur-sm">
                      <div className="font-medium text-foreground text-sm">Build something open source?</div>
                      <p className="text-sm text-muted-foreground">
                         Submit your project to us and let others benefit from your work!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </section>
    </TooltipProvider>
  )
}