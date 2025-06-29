'use client'

import { useState, useId, useEffect, useRef, useCallback } from 'react'
import { Search, Package, ExternalLink, X } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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

interface BuildQuestion {
  id: string
  question: string
  answer: string
}

interface SelectedFeature {
  id: string
  name: string
  description?: string
  featureType?: string
  toolName: string
  toolIcon?: string
  toolColor?: string
}

const starterTemplates = [
  {
    id: '1',
    name: 'Next.js + Keystone Starter',
    description: 'Full-stack template with admin'
  }
]

const buildQuestions: BuildQuestion[] = [
  {
    id: 'item-1',
    question: 'Which features would you like to include?',
    answer: 'Select specific features from proven MIT-licensed open source tools. Popular options include Cal.com\'s scheduling system, Supabase\'s authentication, Stripe\'s payment processing, and many more. Each feature comes with implementation notes and quality scores.',
  },
]

interface PromptBuilderProps {
  onPromptChange?: (prompt: string) => void
  className?: string
}

export function PromptBuilder({ onPromptChange, className }: PromptBuilderProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>([])
  const [showFeatureTooltip, setShowFeatureTooltip] = useState(false)
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

  const handleFeatureSelect = (feature: any, toolName: string, toolIcon?: string, toolColor?: string) => {
    const selectedFeature: SelectedFeature = {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      featureType: feature.featureType,
      toolName,
      toolIcon,
      toolColor
    }

    setSelectedFeatures(prev => {
      const isAlreadySelected = prev.some(f => f.id === feature.id)
      if (isAlreadySelected) {
        return prev.filter(f => f.id !== feature.id)
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

  const generatePrompt = () => {
    const templateInfo = selectedTemplate ? `Using ${starterTemplates.find(t => t.id === selectedTemplate)?.name || 'starter template'}. ` : ''
    const featuresInfo = selectedFeatures.length > 0 ? `Selected features: ${selectedFeatures.map(f => `${f.name} (from ${f.toolName})`).join(', ')}. ` : ''
    
    if (selectedAnswers.length === 0 && !selectedTemplate && selectedFeatures.length === 0) return ''
    
    const prompt = `${templateInfo}${featuresInfo}Build a modern web application with the following specifications: ${selectedAnswers.join(' ')} Please provide a comprehensive implementation plan with step-by-step instructions.`
    return prompt
  }

  const handleAccordionChange = (value: string) => {
    const question = buildQuestions.find(q => q.id === value)
    if (!question) return

    const newAnswers = selectedAnswers.includes(question.answer)
      ? selectedAnswers.filter(answer => answer !== question.answer)
      : [...selectedAnswers, question.answer]
    
    setSelectedAnswers(newAnswers)
    
    const newPrompt = generatePrompt()
    onPromptChange?.(newPrompt)
  }

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    const newPrompt = generatePrompt()
    onPromptChange?.(newPrompt)
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
    <section className={cn("py-8", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Interactive Prompt Builder</h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Customize your project by selecting the features and configurations that match your needs.
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
                        <LogoIcon className="w-6 h-6" />
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
            </div>

            {/* Dash Separator */}
            <div className="border-t border-dashed border-border my-6"></div>

            {/* Features Search */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Features</p>
              
              {/* Selected Features Summary (like starter template) */}
              {selectedFeatures.length > 0 && (
                <div className="border-0 shadow-none">
                  <div className="h-auto ps-2 text-left flex items-center gap-2">
                    <div className="flex items-center gap-3">
                      {/* Show icon from first selected feature's tool */}
                      <ToolIcon
                        name={selectedFeatures[0].toolName}
                        simpleIconSlug={selectedFeatures[0].toolIcon}
                        simpleIconColor={selectedFeatures[0].toolColor}
                        size={24}
                      />
                      <div>
                        <div className="block font-medium">
                          {selectedFeatures.length === 1 
                            ? selectedFeatures[0].name
                            : `${selectedFeatures.length} features selected`
                          }
                        </div>
                        <div className="text-muted-foreground mt-0.5 block text-xs">
                          {selectedFeatures.length === 1 
                            ? `From ${selectedFeatures[0].toolName}`
                            : `From ${new Set(selectedFeatures.map(f => f.toolName)).size} tools`
                          }
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto relative">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onMouseEnter={() => setShowFeatureTooltip(true)}
                        onMouseLeave={() => setShowFeatureTooltip(false)}
                      >
                        <MiniDonutChart
                          value={selectedFeatures.length}
                          total={Math.max(selectedFeatures.length, 5)}
                          size={20}
                          strokeWidth={3}
                          className="text-primary"
                        />
                        <span className="text-xs text-muted-foreground">
                          {selectedFeatures.length}/{Math.max(selectedFeatures.length, 5)}
                        </span>
                      </div>
                      
                      {/* Feature Tooltip */}
                      {showFeatureTooltip && selectedFeatures.length > 0 && (
                        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-md border bg-popover p-3 shadow-lg">
                          <div className="text-sm font-medium mb-2">Selected Features:</div>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {selectedFeatures.map((feature) => (
                              <div key={feature.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="text-green-500">✓</div>
                                <span className="truncate">{feature.name}</span>
                                <span className="text-muted-foreground/60">({feature.toolName})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                                    onClick={() => handleFeatureSelect(toolFeature.feature, tool.name, tool.simpleIconSlug, tool.simpleIconColor)}
                                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center">
                                      {selectedFeatures.some(f => f.id === toolFeature.feature.id) ? (
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
                                        alternative.openSourceTool!.name, 
                                        alternative.openSourceTool!.simpleIconSlug, 
                                        alternative.openSourceTool!.simpleIconColor
                                      )}
                                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                                    >
                                      <div className="flex h-6 w-6 items-center justify-center">
                                        {selectedFeatures.some(f => f.id === toolFeature.feature.id) ? (
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

              {/* Original Accordion for additional questions */}
              <Accordion
                type="multiple"
                className="space-y-0"
              >
                {buildQuestions.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-dashed"
                  >
                    <AccordionTrigger 
                      className="cursor-pointer text-base hover:no-underline"
                      onClick={() => handleAccordionChange(item.id)}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Selected Features Display using DisplayCard format */}
          {Object.values(groupedSelectedFeatures).length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Selected Features</h3>
              <div className="grid gap-4">
                {Object.values(groupedSelectedFeatures).map((group) => (
                  <DisplayCard
                    key={group.toolName}
                    name={group.toolName}
                    description={`Selected ${group.features.length} feature${group.features.length !== 1 ? 's' : ''} from ${group.toolName}`}
                    simpleIconSlug={group.toolIcon}
                    simpleIconColor={group.toolColor}
                    features={group.features.map(f => ({ name: f.name, compatible: true, featureType: f.featureType }))}
                    totalFeatures={group.features.length}
                    compatibilityScore={100}
                    isOpenSource={true}
                    onFeatureClick={(featureName) => {
                      const feature = group.features.find(f => f.name === featureName)
                      if (feature) {
                        handleFeatureRemove(feature.id)
                      }
                    }}
                    selectedFeatures={group.features.map(f => f.name)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}