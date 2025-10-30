import React from 'react'
import { Code, Layers } from 'lucide-react'
import { UniversalSearchDropdown } from './UniversalSearchDropdown'
import type { Capability } from '../../types'

interface CapabilitiesHeroSectionProps {
  capability: Capability;
}

export function CapabilitiesHeroSection({ capability }: CapabilitiesHeroSectionProps) {
  return (
    <div className="h-[500px] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Applications with
          <br />
          <div className="flex items-baseline gap-2">
            <span className="font-geist-sans font-semibold text-muted-foreground">
              {capability.name}
            </span>
            <div className="text-base tracking-normal">
              <UniversalSearchDropdown 
                currentName={capability.name}
                iconColor="#10b981"
              />
            </div>
          </div>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
          {capability.description || `Discover all applications that implement ${capability.name.toLowerCase()} functionality, both proprietary and open source.`}
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-1.5 px-3 py-1.5">
            <span className="text-sm font-medium">
              Category: {capability.category}
            </span>
          </span>
          <span className="inline-flex items-center rounded-md bg-muted shadow-xs ring-1 ring-inset ring-border gap-1.5 px-3 py-1.5">
            <span className="text-sm font-medium">
              Complexity: {capability.complexity}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}