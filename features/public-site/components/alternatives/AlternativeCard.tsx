'use client';

import React, { useState } from 'react';
import { Star, ExternalLink, Check, X, Globe, ChevronRight, ChevronDown } from 'lucide-react';
import ToolIcon from '@/components/ToolIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { MiniDonutChart } from '@/components/ui/mini-donut-chart';
import { cn } from '@/lib/utils';

interface Capability {
  name: string;
  compatible?: boolean;
  category?: string;
  complexity?: string;
  isExtra?: boolean;
}

interface Alternative {
  name: string;
  icon?: string;
  websiteUrl?: string;
  logoSvg?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
}

interface OpenSourceAlternativeProps {
  name?: string;
  description?: string;
  license?: string;
  isOpenSource?: boolean;
  githubStars?: number;
  capabilities?: Capability[];
  repositoryUrl?: string;
  websiteUrl?: string;
  className?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  totalCapabilities?: number;
  compatibilityScore?: number;
  alternatives?: Alternative[];
  onCapabilityClick?: (capability: string) => void;
  selectedCapabilities?: string[];
  extraCapabilitiesCount?: number;
}

// Mini Feature Donut Component
function CapabilityDonut({
  capability,
  onClick,
  isSelected = false
}: {
  capability: Capability;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompatible = capability.compatible !== false;
  const isExtra = capability.isExtra === true;
  const isClickable = isCompatible && onClick; // Only green and blue are clickable

  const handleClick = (e: React.MouseEvent) => {
    if (!isClickable) return;
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  if (!isCompatible) {
    // For missing features, show a fully red donut with opacity - NOT clickable
    return (
      <div
        data-capability
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-background text-xs cursor-default"
      >
        <div className="relative w-3 h-3">
          <svg width="12" height="12" viewBox="0 0 12 12" className="transform -rotate-90">
            <circle
              cx="6"
              cy="6"
              r="4"
              fill="none"
              stroke="rgb(239 68 68 / 0.3)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <span className="font-medium text-muted-foreground">
          {capability.name}
        </span>
      </div>
    );
  }

  if (isExtra) {
    // For extra capabilities (OS has but proprietary doesn't), show blue donut - clickable
    return (
      <div
        data-capability
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-background text-xs transition-colors",
          isClickable ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950 dark:hover:border-blue-700" : "cursor-default",
          isSelected && "border-orange-500 bg-orange-50 dark:bg-orange-950"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={isClickable ? "Click to add to build" : undefined}
      >
        {isClickable && isHovered ? (
          <div className="w-3 h-3 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-blue-500">
              <path
                d="M6 2v8M2 6h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <MiniDonutChart
            value={1}
            total={1}
            size={12}
            strokeWidth={2}
            color="text-blue-500"
          />
        )}
        <span className="font-medium text-foreground">
          {capability.name}
        </span>
      </div>
    );
  }

  // For matching capabilities, show green donut - clickable
  return (
    <div
      data-capability
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-background text-xs transition-colors",
        isClickable ? "cursor-pointer hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950 dark:hover:border-green-700" : "cursor-default",
        isSelected && "border-orange-500 bg-orange-50 dark:bg-orange-950"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isClickable ? "Click to add to build" : undefined}
    >
      {isClickable && isHovered ? (
        <div className="w-3 h-3 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-green-500">
            <path
              d="M6 2v8M2 6h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <MiniDonutChart
          value={1}
          total={1}
          size={12}
          strokeWidth={2}
          className={isSelected ? "text-orange-500" : ""}
        />
      )}
      <span className="font-medium text-foreground">
        {capability.name}
      </span>
    </div>
  );
}

export function DisplayCard({
  name = "LibreOffice",
  description = "A powerful, free office suite that provides a great alternative to Microsoft Office with full document compatibility and advanced features.",
  license = "MPL-2.0",
  isOpenSource = true,
  githubStars = 3542,
  capabilities = [
    { name: "Document Editing", compatible: true },
    { name: "Spreadsheets", compatible: true },
    { name: "Presentations", compatible: true },
    { name: "Cloud Sync", compatible: false },
    { name: "Real-time Collaboration", compatible: false },
    { name: "Advanced Charts", compatible: true }
  ],
  repositoryUrl = "https://github.com/LibreOffice/core",
  websiteUrl = "https://www.libreoffice.org",
  className,
  simpleIconSlug,
  simpleIconColor,
  totalCapabilities,
  compatibilityScore,
  alternatives = [],
  onCapabilityClick,
  selectedCapabilities = [],
  extraCapabilitiesCount,
  // Legacy props for compatibility
  title,
  starCount,
  featuresCount,
  ...props
}: OpenSourceAlternativeProps & {
  // Legacy props for backward compatibility
  title?: string;
  starCount?: number;
  featuresCount?: number;
  icon?: React.ReactNode;
  meta?: string;
  flowsCount?: number;
  missingFeatures?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  // Use legacy props if new ones aren't provided
  const displayName = name || title || "Unknown Tool";
  const displayStars = githubStars || starCount || 0;
  const displayCapabilities = capabilities && capabilities.length > 0 ? capabilities : 
    (featuresCount ? Array.from({ length: featuresCount }, (_, i) => ({ 
      name: `Feature ${i + 1}`, 
      compatible: true,
      featureType: undefined
    })) : []);

  const formatStars = (stars: number) => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };


  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border bg-background p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1",
        "dark:hover:shadow-white/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ToolIcon
            name={displayName}
            simpleIconSlug={simpleIconSlug}
            simpleIconColor={simpleIconColor}
            size={56}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            {/* License and Open Source Info below title - Mobile Friendly */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span>{isOpenSource ? "Open Source" : "Proprietary"}</span>
              </div>
              
              {license && (
                <>
                  {/* Hide separator on mobile, show on desktop */}
                  <span className="hidden sm:inline">∙</span>
                  <div className="flex items-center gap-1.5">
                    <span>{license}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Top Right Stats and Website Link */}
        <div className="flex items-center gap-2">
          {displayStars > 0 && (
            repositoryUrl ? (
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Star className="w-4 h-4" />
                <span className="font-medium">{formatStars(displayStars)}</span>
              </a>
            ) : (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span className="font-medium">{formatStars(displayStars)}</span>
              </div>
            )
          )}
          {websiteUrl && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-muted/50"
              asChild
            >
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
              </a>
            </Button>
          )}
        </div>
      </div>


      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 mt-4">
        {description}
      </p>

      {/* Alternatives Section */}
      {alternatives && alternatives.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Alternative to</p>
          <div className="flex flex-wrap gap-1">
            {alternatives.slice(0, 3).map((alt, index) => (
              <div key={index} className="flex items-center gap-1 py-0.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center overflow-hidden">
                  {alt.simpleIconSlug ? (
                    <div 
                      className="w-full h-full"
                      style={{ 
                        backgroundColor: alt.simpleIconColor || '#6B7280',
                        mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${alt.simpleIconSlug}.svg) no-repeat center`,
                        WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${alt.simpleIconSlug}.svg) no-repeat center`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                      }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full rounded-sm flex items-center justify-center text-white font-instrument-serif font-bold"
                      style={{ 
                        backgroundColor: alt.simpleIconColor || '#6B7280',
                        fontSize: '8px'
                      }}
                    >
                      {alt.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="truncate max-w-20">{alt.name}</span>
              </div>
            ))}
            {alternatives.length > 3 && (
              <div className="px-2 py-0.5 text-xs text-muted-foreground">
                +{alternatives.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Capability Details with StatusBadge as Trigger */}
      {displayCapabilities.length > 0 && totalCapabilities && totalCapabilities > 0 && (
        <details
          className="group"
          onToggle={(e) => setIsDetailsOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary
            className="cursor-pointer list-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-x-2.5 rounded-full bg-background px-3 py-2 text-sm border hover:bg-muted/50 transition-colors">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <MiniDonutChart
                  value={displayCapabilities.filter(f => f.compatible !== false && !f.isExtra).length}
                  total={totalCapabilities}
                  size={16}
                  strokeWidth={2}
                />
                {`${displayCapabilities.filter(f => f.compatible !== false && !f.isExtra).length}/${totalCapabilities}`}
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                {`${compatibilityScore || 0}%`}
              </span>
              {extraCapabilitiesCount !== undefined && extraCapabilitiesCount > 0 && (
                <>
                  <span className="h-4 w-px bg-border" />
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    +{extraCapabilitiesCount} more
                  </span>
                </>
              )}
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center">
                {isDetailsOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            </div>
          </summary>
          <div className="mt-4 bg-muted/30 rounded-lg p-4 border border-border/50 shadow-inner">
            <div className="flex flex-wrap gap-2">
              {displayCapabilities
                .slice(0, showAllFeatures ? displayCapabilities.length : 8)
                .sort((a, b) => {
                  // Sort order: green (matching) -> blue (extra) -> red (missing)
                  const aIsMatching = a.compatible !== false && !a.isExtra;
                  const aIsExtra = a.isExtra === true;
                  const aIsMissing = a.compatible === false;

                  const bIsMatching = b.compatible !== false && !b.isExtra;
                  const bIsExtra = b.isExtra === true;
                  const bIsMissing = b.compatible === false;

                  // Green (matching) comes first
                  if (aIsMatching && !bIsMatching) return -1;
                  if (!aIsMatching && bIsMatching) return 1;

                  // Blue (extra) comes second
                  if (aIsExtra && !bIsExtra) return -1;
                  if (!aIsExtra && bIsExtra) return 1;

                  // Red (missing) comes last
                  if (aIsMissing && !bIsMissing) return 1;
                  if (!aIsMissing && bIsMissing) return -1;

                  return 0;
                })
                .map((capability, index) => (
                  <CapabilityDonut 
                    key={index} 
                    capability={capability}
                    onClick={() => onCapabilityClick?.(capability.name)}
                    isSelected={selectedCapabilities.includes(capability.name)}
                  />
                ))}
              {!showAllFeatures && displayCapabilities.length > 8 && (
                <div 
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-muted/30 text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllFeatures(true);
                  }}
                >
                  <span className="font-medium text-muted-foreground">
                    +{displayCapabilities.length - 8} more capabilities
                  </span>
                </div>
              )}
            </div>
          </div>
        </details>
      )}

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent transition-opacity duration-300 pointer-events-none",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Card>
  );
}