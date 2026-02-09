'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, GitFork, ExternalLink, Github, Check, X, ChevronDown, ChevronRight, FileCode, BookOpen, ArrowUpRight } from 'lucide-react';
import ToolIcon from '@/components/ToolIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ComparisonApplication } from '../lib/data';
import { ComparisonSearchDropdown } from '../components/alternatives/ComparisonSearchDropdown';

interface ComparisonPageClientProps {
  app1: ComparisonApplication;
  app2: ComparisonApplication;
}

interface CapabilityRowProps {
  name: string;
  slug: string;
  app1Has: boolean;
  app2Has: boolean;
  app1Details?: {
    implementationNotes?: string;
    githubPath?: string;
    documentationUrl?: string;
    implementationComplexity?: string;
  };
  app2Details?: {
    implementationNotes?: string;
    githubPath?: string;
    documentationUrl?: string;
    implementationComplexity?: string;
  };
  app1RepositoryUrl?: string;
  app2RepositoryUrl?: string;
  app1Name: string;
  app2Name: string;
  app1Icon: { slug?: string; color?: string };
  app2Icon: { slug?: string; color?: string };
}

function CapabilityRow({ 
  name, 
  slug, 
  app1Has, 
  app2Has, 
  app1Details, 
  app2Details,
  app1RepositoryUrl,
  app2RepositoryUrl,
  app1Name,
  app2Name,
  app1Icon,
  app2Icon,
}: CapabilityRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = (app1Details?.implementationNotes || app1Details?.githubPath || app1Details?.documentationUrl) ||
                     (app2Details?.implementationNotes || app2Details?.githubPath || app2Details?.documentationUrl);

  return (
    <>
      <div 
        className={cn(
          "border-b border-border/30 py-3 md:py-4 px-4 md:px-5 hover:bg-muted/20 transition-colors",
          hasDetails && "cursor-pointer"
        )}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasDetails && (
              <span className="text-muted-foreground/60 flex-shrink-0">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
            <Link 
              href={`/capabilities/${slug}`}
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {name}
            </Link>
          </div>
          <div className="flex items-center gap-8 flex-shrink-0 ml-3">
            <div className="w-24 flex items-center justify-center">
              {app1Has ? (
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
                </div>
              ) : (
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="w-24 flex items-center justify-center">
              {app2Has ? (
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
                </div>
              ) : (
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isExpanded && hasDetails && (
        <div className="bg-muted/10 px-4 md:px-6 py-4 md:py-6 border-b border-border/30">
          <div className="space-y-6">
            {app1Has && app1Details && (app1Details.implementationNotes || app1Details.githubPath || app1Details.documentationUrl) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ToolIcon name={app1Name} simpleIconSlug={app1Icon.slug} simpleIconColor={app1Icon.color} size={16} />
                  {app1Name} Implementation
                </div>
                <div className="pl-6 space-y-3">
                  {app1Details.implementationNotes && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                      {app1Details.implementationNotes}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {app1Details.implementationComplexity && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {app1Details.implementationComplexity}
                      </Badge>
                    )}
                    {app1Details.githubPath && app1RepositoryUrl && (
                      <a
                        href={`${app1RepositoryUrl}/tree/main/${app1Details.githubPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-background px-2 py-1 rounded border shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        {app1Details.githubPath}
                      </a>
                    )}
                    {app1Details.documentationUrl && (
                      <a
                        href={app1Details.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-background px-2 py-1 rounded border shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Documentation
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {app2Has && app2Details && (app2Details.implementationNotes || app2Details.githubPath || app2Details.documentationUrl) && (
              <div className="space-y-3 pt-4 border-t border-border/20">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ToolIcon name={app2Name} simpleIconSlug={app2Icon.slug} simpleIconColor={app2Icon.color} size={16} />
                  {app2Name} Implementation
                </div>
                <div className="pl-6 space-y-3">
                  {app2Details.implementationNotes && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                      {app2Details.implementationNotes}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {app2Details.implementationComplexity && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {app2Details.implementationComplexity}
                      </Badge>
                    )}
                    {app2Details.githubPath && app2RepositoryUrl && (
                      <a
                        href={`${app2RepositoryUrl}/tree/main/${app2Details.githubPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-background px-2 py-1 rounded border shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        {app2Details.githubPath}
                      </a>
                    )}
                    {app2Details.documentationUrl && (
                      <a
                        href={app2Details.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-background px-2 py-1 rounded border shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Documentation
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ComparisonHeroSection({ app1, app2 }: { app1: ComparisonApplication, app2: ComparisonApplication }) {
  return (
    <div className="h-[500px] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <ToolIcon
            name={app1.name}
            simpleIconSlug={app1.simpleIconSlug}
            simpleIconColor={app1.simpleIconColor}
            size={64}
          />
          <span className="text-3xl text-muted-foreground/30 font-light italic">vs</span>
          <ToolIcon
            name={app2.name}
            simpleIconSlug={app2.simpleIconSlug}
            simpleIconColor={app2.simpleIconColor}
            size={64}
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Comparison
          <br />
          between
          <br />
          <div className="flex items-baseline flex-wrap gap-x-3">
            <div className="flex items-baseline gap-2">
              <span className="font-geist-sans font-semibold text-muted-foreground">
                {app1.name}
              </span>
              <div className="text-base tracking-normal">
                <ComparisonSearchDropdown 
                  currentApp={{ slug: app1.slug, name: app1.name, color: app1.simpleIconColor }}
                  otherAppSlug={app2.slug}
                  position="left"
                />
              </div>
            </div>
            <span className="text-muted-foreground/40 font-normal">vs</span>
            <div className="flex items-baseline gap-2">
              <span className="font-geist-sans font-semibold text-muted-foreground">
                {app2.name}
              </span>
              <div className="text-base tracking-normal">
                <ComparisonSearchDropdown 
                  currentApp={{ slug: app2.slug, name: app2.name, color: app2.simpleIconColor }}
                  otherAppSlug={app1.slug}
                  position="right"
                />
              </div>
            </div>
          </div>
        </h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-muted shadow-xs ring-1 ring-inset ring-border">
            <span 
              className="size-2.5 shrink-0 rounded-full outline outline-3 -outline-offset-1" 
              style={{ 
                backgroundColor: app1.simpleIconColor || '#3b82f6',
                outlineColor: `${app1.simpleIconColor || '#3b82f6'}30`
              }} 
            />
            <span className="text-sm font-medium mb-[1px]">{app1.isOpenSource ? 'Open Source' : 'Proprietary'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-muted shadow-xs ring-1 ring-inset ring-border">
            <span 
              className="size-2.5 shrink-0 rounded-full outline outline-3 -outline-offset-1" 
              style={{ 
                backgroundColor: app2.simpleIconColor || '#3b82f6',
                outlineColor: `${app2.simpleIconColor || '#3b82f6'}30`
              }} 
            />
            <span className="text-sm font-medium mb-[1px]">{app2.isOpenSource ? 'Open Source' : 'Proprietary'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppHeader({ app, compact = false }: { app: ComparisonApplication; compact?: boolean }) {
  const formatStars = (stars: number) => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4">
        <ToolIcon
          name={app.name}
          simpleIconSlug={app.simpleIconSlug}
          simpleIconColor={app.simpleIconColor}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate leading-tight">{app.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border border-border shadow-xs scale-90 origin-left">
              <span 
                className="size-1.5 shrink-0 rounded-full outline outline-2 -outline-offset-1" 
                style={{ 
                  backgroundColor: app.simpleIconColor || '#3b82f6',
                  outlineColor: `${app.simpleIconColor || '#3b82f6'}30`
                }} 
              />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {app.isOpenSource ? 'Open Source' : 'Proprietary'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 -mt-1">
          {app.isOpenSource && app.githubStars && app.repositoryUrl && (
            <Button variant="ghost" className="h-7 px-1.5 gap-1 hover:bg-muted text-muted-foreground/60" asChild>
              <a href={app.repositoryUrl} target="_blank" rel="noopener noreferrer">
                <Star className="w-3 h-3" />
                <span className="text-[11px] font-medium">{formatStars(app.githubStars)}</span>
              </a>
            </Button>
          )}
          {app.websiteUrl && (
            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-muted" asChild>
              <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function ComparisonPageClient({ app1, app2 }: ComparisonPageClientProps) {
  const app1CapMap = new Map(
    app1.capabilities.map(c => [c.capability.id, c])
  );
  const app2CapMap = new Map(
    app2.capabilities.map(c => [c.capability.id, c])
  );

  const allCapabilityIds = new Set([
    ...app1.capabilities.map(c => c.capability.id),
    ...app2.capabilities.map(c => c.capability.id),
  ]);

  const comparisonRows = Array.from(allCapabilityIds).map(capId => {
    const app1Cap = app1CapMap.get(capId);
    const app2Cap = app2CapMap.get(capId);
    const capability = app1Cap?.capability || app2Cap?.capability;

    return {
      id: capId,
      name: capability?.name || '',
      slug: capability?.slug || '',
      app1Has: !!app1Cap,
      app2Has: !!app2Cap,
      app1Details: app1Cap ? {
        implementationNotes: app1Cap.implementationNotes,
        githubPath: app1Cap.githubPath,
        documentationUrl: app1Cap.documentationUrl,
        implementationComplexity: app1Cap.implementationComplexity,
      } : undefined,
      app2Details: app2Cap ? {
        implementationNotes: app2Cap.implementationNotes,
        githubPath: app2Cap.githubPath,
        documentationUrl: app2Cap.documentationUrl,
        implementationComplexity: app2Cap.implementationComplexity,
      } : undefined,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const bothHave = comparisonRows.filter(r => r.app1Has && r.app2Has).length;
  const onlyApp1 = comparisonRows.filter(r => r.app1Has && !r.app2Has).length;
  const onlyApp2 = comparisonRows.filter(r => !r.app1Has && r.app2Has).length;

  return (
    <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
      {/* Content wrapper from AlternativesPage.tsx */}
      <div className="relative">
        <ComparisonHeroSection app1={app1} app2={app2} />
        
        <div className="mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8 max-w-5xl">
          {/* Left: Comparison Table */}
          <div className="md:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Capabilities</h2>
            </div>
            
            {/* Capabilities List - matching EventsSection/AlternativeCard style wrapper */}
            <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
              <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 overflow-hidden">
                {/* Header */}
                <div className="hidden md:flex border-b border-border/50 py-4 px-5 items-end">
                  <div className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">Capability</div>
                  <div className="flex items-center gap-8">
                    <div className="w-24 flex flex-col items-center justify-center gap-2">
                      <ToolIcon name={app1.name} simpleIconSlug={app1.simpleIconSlug} simpleIconColor={app1.simpleIconColor} size={32} />
                      <span className="truncate max-w-[80px] text-[10px] font-bold uppercase tracking-wider text-center">{app1.name}</span>
                    </div>
                    <div className="w-24 flex flex-col items-center justify-center gap-2">
                      <ToolIcon name={app2.name} simpleIconSlug={app2.simpleIconSlug} simpleIconColor={app2.simpleIconColor} size={32} />
                      <span className="truncate max-w-[80px] text-[10px] font-bold uppercase tracking-wider text-center">{app2.name}</span>
                    </div>
                  </div>
                </div>
                {/* Rows */}
                {comparisonRows.length > 0 ? (
                  comparisonRows.map((row) => (
                    <CapabilityRow
                      key={row.id}
                      name={row.name}
                      slug={row.slug}
                      app1Has={row.app1Has}
                      app2Has={row.app2Has}
                      app1Details={row.app1Details}
                      app2Details={row.app2Details}
                      app1RepositoryUrl={app1.repositoryUrl}
                      app2RepositoryUrl={app2.repositoryUrl}
                      app1Name={app1.name}
                      app2Name={app2.name}
                      app1Icon={{ slug: app1.simpleIconSlug, color: app1.simpleIconColor }}
                      app2Icon={{ slug: app2.simpleIconSlug, color: app2.simpleIconColor }}
                    />
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No capabilities to compare yet.
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-500" />
                </div>
                Supported
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-muted-foreground/40" />
                </div>
                Not available
              </span>
            </div>
          </div>

          {/* Right: Sidebar matching StatsCard style */}
          <div className="md:w-1/3 space-y-6">
            {/* Stats Card */}
            <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
              <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 p-4 space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Comparison Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shared capabilities</span>
                    <span className="text-lg font-semibold text-green-500">{bothHave}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ToolIcon name={app1.name} simpleIconSlug={app1.simpleIconSlug} simpleIconColor={app1.simpleIconColor} size={16} />
                      <span className="text-sm truncate max-w-[120px]">Only {app1.name}</span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">{onlyApp1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ToolIcon name={app2.name} simpleIconSlug={app2.simpleIconSlug} simpleIconColor={app2.simpleIconColor} size={16} />
                      <span className="text-sm truncate max-w-[120px]">Only {app2.name}</span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">{onlyApp2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* App 1 Card */}
            <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50 hover:shadow-lg">
              <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1">
                <AppHeader app={app1} compact />
              </div>
            </div>

            {/* App 2 Card */}
            <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50 hover:shadow-lg">
              <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1">
                <AppHeader app={app2} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
