import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import ToolIcon from '@/components/ToolIcon'
import { UniversalSearchDropdown } from './UniversalSearchDropdown'
import type { OpenSourceApplication, ProprietaryApplication } from '../../types'

interface OsAlternativesHeroSectionProps {
  openSourceApp: OpenSourceApplication;
  proprietaryApp: ProprietaryApplication;
}

export function OsAlternativesHeroSection({ openSourceApp, proprietaryApp }: OsAlternativesHeroSectionProps) {
  return (
    <div className="h-[500px] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
        <div className="mb-4">
          <ToolIcon
            name={openSourceApp.name}
            simpleIconSlug={openSourceApp.simpleIconSlug}
            simpleIconColor={openSourceApp.simpleIconColor}
            size={64}
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Open source
          <br />
          alternatives to
          <br />
          <div className="flex items-baseline gap-2">
            <span className="font-geist-sans font-semibold text-muted-foreground">
              {openSourceApp.name}
            </span>
            <div className="text-base tracking-normal">
              <UniversalSearchDropdown 
                currentName={openSourceApp.name}
                iconColor={openSourceApp.simpleIconColor}
              />
            </div>
          </div>
        </h1>
        <div className="flex items-center mb-6">
          <a
            href={openSourceApp.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-muted shadow-xs ring-1 ring-inset ring-border gap-2.5 px-3 py-1 hover:bg-muted/80 transition-colors"
          >
            <span
              className="size-2.5 shrink-0 rounded-full outline outline-3 -outline-offset-1"
              style={{
                backgroundColor: openSourceApp.simpleIconColor || '#3b82f6',
                outlineColor: `${openSourceApp.simpleIconColor || '#3b82f6'}30`
              }}
            />
            <span className="text-sm font-medium mb-[1px]">
              {openSourceApp.websiteUrl
                ? openSourceApp.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
                : 'website.com'}
            </span>
            <ArrowUpRight className="size-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  )
}