'use client'

import { useState } from 'react'
import { Star, Github, Globe, ArrowUpRight } from 'lucide-react'
import ToolLogo from './ToolLogo'
import { DonutChart } from '@/components/ui/donut-chart'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/status-badge'

interface MistFeatures6ClientProps {
  proprietarySoftware: any[]
  allAlternatives: { [key: string]: any[] }
  initialSoftware: string
}

export default function MistFeatures6Client({ proprietarySoftware, allAlternatives, initialSoftware }: MistFeatures6ClientProps) {
  const [selectedSoftware, setSelectedSoftware] = useState(initialSoftware)
  const [alternatives, setAlternatives] = useState(allAlternatives[initialSoftware] || [])

  const handleSoftwareSelect = (software: string) => {
    if (software === selectedSoftware) return
    
    setSelectedSoftware(software)
    setAlternatives(allAlternatives[software] || [])
  }

  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">
              Discover powerful open source alternatives to your favorite software
            </h2>
          </div>
          
          {/* Logo Cloud - Software Selection */}
          <div className="mt-16">
            <LogoCloud 
              proprietarySoftware={proprietarySoftware}
              selectedSoftware={selectedSoftware}
              onSoftwareSelect={handleSoftwareSelect} 
            />
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alternatives.length > 0 ? (
              alternatives.map((alternative) => {
                const matchingFeatures = alternative.features?.length || 0
                const totalFeatures = 10 // Can be made dynamic later
                const compatibilityScore = totalFeatures > 0 ? Math.round((matchingFeatures / totalFeatures) * 100) : 0

                return (
                  <TooltipProvider key={alternative.id}>
                    <Link href={`/tools/${alternative.slug}`}>
                      <div
                        className={cn(
                          "group relative p-1 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 w-full",
                          "shadow-black-950/10 bg-zinc-100/80 border",
                          "border-gray-300 dark:border-gray-700 ring-2 ring-gray-300/50 dark:ring-gray-600/50",
                          "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                          "cursor-pointer"
                        )}
                      >
                        <div className="relative flex flex-col">
                          <div className="space-y-2 text-card-foreground rounded-lg bg-card dark:bg-card border shadow border-transparent ring-1 ring-foreground/5 p-3">
                            <div className="flex items-center justify-between">
                              <h3 className="flex items-center font-medium text-foreground dark:text-foreground tracking-tight text-[15px]">
                                <div className="flex flex-col">
                                  <span>{alternative.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StatusBadge
                                      status="success"
                                      leftLabel="Open Source"
                                      rightLabel={alternative.license || "Unknown"}
                                      className="text-[10px] px-1.5 py-0.5 gap-x-1.5"
                                    />
                                  </div>
                                </div>
                              </h3>
                              
                              {/* Donut Chart in Top Right */}
                              {matchingFeatures > 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-1 cursor-help">
                                      <DonutChart 
                                        value={matchingFeatures} 
                                        total={totalFeatures}
                                        size={32}
                                        strokeWidth={3}
                                        className="shrink-0"
                                      />
                                      <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400">
                                        {compatibilityScore}%
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="dark py-3 z-50 max-w-sm" side="top" align="end" sideOffset={8}>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[13px] font-medium">Feature Compatibility</p>
                                        <span className="text-[13px] text-gray-400">{compatibilityScore}%</span>
                                      </div>
                                      <div className="text-xs text-gray-300">
                                        <div className="font-medium">{matchingFeatures} of {totalFeatures} features</div>
                                        {matchingFeatures < totalFeatures && (
                                          <div className="text-gray-500 mt-1">
                                            Missing: {totalFeatures - matchingFeatures} features
                                          </div>
                                        )}
                                      </div>
                                      <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {alternative.features?.slice(0, 8).map((feature: any, index: number) => (
                                          <div key={index} className="flex items-center gap-2 text-xs">
                                            <div className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                                            <span className="text-gray-300">{feature.feature.name}</span>
                                          </div>
                                        ))}
                                        {(alternative.features?.length || 0) > 8 && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            +{(alternative.features?.length || 0) - 8} more features
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground font-[425] line-clamp-2 leading-relaxed">
                              {alternative.description}
                            </p>
                          </div>

                          {/* Bottom Action Bar */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              {/* Star Count */}
                              {alternative.githubStars && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-muted/40 dark:bg-muted/30 text-muted-foreground border border-border cursor-help">
                                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                      <span className="text-[10px] font-medium">
                                        {alternative.githubStars >= 1000 
                                          ? `${(alternative.githubStars / 1000).toFixed(1)}k` 
                                          : alternative.githubStars.toString()}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="z-50" side="top" sideOffset={8}>
                                    <p>GitHub Stars</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Category */}
                              {alternative.category && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-muted/40 dark:bg-muted/30 text-muted-foreground border border-border">
                                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                  <span className="text-[10px] font-medium">{alternative.category.name}</span>
                                </span>
                              )}
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-1">
                              {alternative.websiteUrl && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 hover:bg-muted/50"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(alternative.websiteUrl, '_blank', 'noopener,noreferrer');
                                      }}
                                    >
                                      <Globe className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="z-50" side="top" sideOffset={8}>
                                    <p>Visit Website</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              
                              {alternative.repositoryUrl && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 hover:bg-muted/50"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(alternative.repositoryUrl, '_blank', 'noopener,noreferrer');
                                      }}
                                    >
                                      <Github className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="z-50" side="top" sideOffset={8}>
                                    <p>View Repository</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 hover:bg-muted/50"
                                  >
                                    <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="z-50" side="top" sideOffset={8}>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        />
                      </div>
                    </Link>
                  </TooltipProvider>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No alternatives found for {selectedSoftware}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function LogoCloud({ 
  proprietarySoftware, 
  selectedSoftware, 
  onSoftwareSelect 
}: { 
  proprietarySoftware: any[];
  selectedSoftware: string;
  onSoftwareSelect: (software: string) => void;
}) {
  return (
    <section className="bg-background overflow-hidden py-16">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">Choose software to see alternatives</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={112}>
              {proprietarySoftware.map((software, index) => (
                <div key={`${software.name}-${index}`} className="flex">
                  <button
                    onClick={() => onSoftwareSelect(software.name)}
                    className={`flex flex-col items-center gap-2 p-3 hover:opacity-80 transition-all cursor-pointer ${
                      selectedSoftware === software.name ? 'opacity-100 scale-105' : 'opacity-70'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ToolLogo 
                        name={software.name}
                        resolvedLogo={software.resolvedLogo}
                        size={32}
                      />
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">{software.name}</span>
                  </button>
                </div>
              ))}
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}