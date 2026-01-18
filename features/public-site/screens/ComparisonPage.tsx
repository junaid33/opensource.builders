'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, GitFork, ExternalLink, Github, Check, X, ChevronDown, ChevronRight, FileCode, BookOpen } from 'lucide-react';
import ToolIcon from '@/components/ToolIcon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ComparisonApplication } from '../lib/data';

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
          <div className="flex items-center gap-3 md:gap-8 flex-shrink-0 ml-3">
            <div className="flex items-center gap-1.5">
              <span className="md:hidden">
                <ToolIcon name={app1Name} simpleIconSlug={app1Icon.slug} simpleIconColor={app1Icon.color} size={14} />
              </span>
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
            <div className="flex items-center gap-1.5">
              <span className="md:hidden">
                <ToolIcon name={app2Name} simpleIconSlug={app2Icon.slug} simpleIconColor={app2Icon.color} size={14} />
              </span>
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
        <div className="bg-muted/10 px-4 md:px-6 py-3 md:py-4 border-b border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground md:hidden">
                <ToolIcon name={app1Name} simpleIconSlug={app1Icon.slug} simpleIconColor={app1Icon.color} size={14} />
                {app1Name}
              </div>
              {app1Has && app1Details ? (
                <>
                  {app1Details.implementationNotes && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
                        className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileCode className="w-3 h-3" />
                        {app1Details.githubPath}
                      </a>
                    )}
                    {app1Details.documentationUrl && (
                      <a
                        href={app1Details.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen className="w-3 h-3" />
                        Docs
                      </a>
                    )}
                  </div>
                </>
              ) : app1Has ? (
                <p className="text-sm text-muted-foreground/60 italic">No details</p>
              ) : (
                <p className="text-sm text-muted-foreground/40 italic">Not available</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground md:hidden">
                <ToolIcon name={app2Name} simpleIconSlug={app2Icon.slug} simpleIconColor={app2Icon.color} size={14} />
                {app2Name}
              </div>
              {app2Has && app2Details ? (
                <>
                  {app2Details.implementationNotes && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
                        className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileCode className="w-3 h-3" />
                        {app2Details.githubPath}
                      </a>
                    )}
                    {app2Details.documentationUrl && (
                      <a
                        href={app2Details.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen className="w-3 h-3" />
                        Docs
                      </a>
                    )}
                  </div>
                </>
              ) : app2Has ? (
                <p className="text-sm text-muted-foreground/60 italic">No details</p>
              ) : (
                <p className="text-sm text-muted-foreground/40 italic">Not available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
      <div className="flex items-center gap-3 p-4">
        <ToolIcon
          name={app.name}
          simpleIconSlug={app.simpleIconSlug}
          simpleIconColor={app.simpleIconColor}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">{app.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={app.isOpenSource ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
              {app.isOpenSource ? "OSS" : "Prop"}
            </Badge>
            {app.isOpenSource && app.githubStars && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3" />
                {formatStars(app.githubStars)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          {app.websiteUrl && (
            <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
              <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
          {app.repositoryUrl && (
            <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
              <a href={app.repositoryUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center p-6 space-y-4">
      <ToolIcon
        name={app.name}
        simpleIconSlug={app.simpleIconSlug}
        simpleIconColor={app.simpleIconColor}
        size={56}
      />
      <div>
        <h2 className="text-lg font-semibold">{app.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant={app.isOpenSource ? "default" : "secondary"} className="text-xs">
            {app.isOpenSource ? "Open Source" : "Proprietary"}
          </Badge>
          {app.license && (
            <Badge variant="outline" className="text-xs">{app.license}</Badge>
          )}
        </div>
      </div>
      
      {app.isOpenSource && app.githubStars && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4" />
            {formatStars(app.githubStars)}
          </span>
          {app.githubForks && (
            <span className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4" />
              {formatStars(app.githubForks)}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {app.websiteUrl && (
          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
            <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Website
            </a>
          </Button>
        )}
        {app.repositoryUrl && (
          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
            <a href={app.repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-3.5 h-3.5 mr-1.5" />
              GitHub
            </a>
          </Button>
        )}
      </div>
    </div>
  );
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
      {/* Hero Section */}
      <div className="h-[280px] md:h-[320px] overflow-hidden">
        <div className="flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ToolIcon
              name={app1.name}
              simpleIconSlug={app1.simpleIconSlug}
              simpleIconColor={app1.simpleIconColor}
              size={48}
            />
            <span className="text-2xl text-muted-foreground/40 font-light">vs</span>
            <ToolIcon
              name={app2.name}
              simpleIconSlug={app2.simpleIconSlug}
              simpleIconColor={app2.simpleIconColor}
              size={48}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {app1.name}
            <span className="text-muted-foreground font-normal"> vs </span>
            {app2.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare capabilities side by side
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8 max-w-5xl w-full">
        {/* Left: Comparison Table */}
        <div className="lg:w-2/3 order-2 lg:order-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Capabilities</h2>
          </div>
          
          {/* Capabilities List */}
          <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
            <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 overflow-hidden">
              {/* Header */}
              <div className="hidden md:flex border-b border-border/50 py-3 px-5">
                <div className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Capability</div>
                <div className="flex items-center gap-8">
                  <div className="w-20 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <ToolIcon name={app1.name} simpleIconSlug={app1.simpleIconSlug} simpleIconColor={app1.simpleIconColor} size={16} />
                    <span className="truncate">{app1.name}</span>
                  </div>
                  <div className="w-20 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <ToolIcon name={app2.name} simpleIconSlug={app2.simpleIconSlug} simpleIconColor={app2.simpleIconColor} size={16} />
                    <span className="truncate">{app2.name}</span>
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

        {/* Right: Stats Cards */}
        <div className="lg:w-1/3 space-y-4 order-1 lg:order-2">
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
                  <span className="text-lg font-semibold" style={{ color: app1.simpleIconColor || '#3b82f6' }}>{onlyApp1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ToolIcon name={app2.name} simpleIconSlug={app2.simpleIconSlug} simpleIconColor={app2.simpleIconColor} size={16} />
                    <span className="text-sm truncate max-w-[120px]">Only {app2.name}</span>
                  </div>
                  <span className="text-lg font-semibold" style={{ color: app2.simpleIconColor || '#8b5cf6' }}>{onlyApp2}</span>
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
  );
}
