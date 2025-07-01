'use client';

import React, { useState } from 'react';
import { Star, ExternalLink, Check, X, Globe, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { MiniDonutChart } from '@/components/ui/mini-donut-chart';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  compatible?: boolean;
  featureType?: string;
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
  features?: Feature[];
  repositoryUrl?: string;
  websiteUrl?: string;
  className?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  totalFeatures?: number;
  compatibilityScore?: number;
  alternatives?: Alternative[];
  onFeatureClick?: (feature: string) => void;
  selectedFeatures?: string[];
}

// Mini Feature Donut Component
function FeatureDonut({ 
  feature, 
  onClick, 
  isSelected = false 
}: { 
  feature: Feature; 
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const isCompatible = feature.compatible !== false;
  
  if (!isCompatible) {
    // For inactive features, show a fully red donut with opacity
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-background text-xs cursor-pointer transition-colors",
          isSelected ? "border-orange-500 bg-orange-50" : "hover:bg-muted/50"
        )}
        onClick={onClick}
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
          {feature.name}
        </span>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-background text-xs cursor-pointer transition-colors",
        isSelected ? "border-orange-500 bg-orange-50" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <MiniDonutChart
        value={isSelected ? 1 : 1}
        total={1}
        size={12}
        strokeWidth={2}
        className={isSelected ? "text-orange-500" : ""}
      />
      <span className="font-medium text-foreground">
        {feature.name}
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
  features = [
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
  totalFeatures,
  compatibilityScore,
  alternatives = [],
  onFeatureClick,
  selectedFeatures = [],
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
  const displayFeatures = features.length > 0 ? features : 
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
          {simpleIconSlug ? (
            <div 
              className="flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
              style={{ 
                width: 56, 
                height: 56,
                background: simpleIconColor || '#6B7280'
              }}
            >
              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: "256px 256px",
                }}
              />
              
              <img
                src={`https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${simpleIconSlug}.svg`}
                alt={`${name} icon`}
                className="relative z-10"
                style={{ 
                  width: 32, 
                  height: 32,
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9
                }}
              />
              
              {/* Subtle highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
            </div>
          ) : (
            <div 
              className={`flex aspect-square items-center justify-center rounded-md overflow-hidden ${simpleIconColor ? '' : 'bg-gradient-to-br from-slate-800 to-slate-900'} relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none`}
              style={{ 
                width: 56, 
                height: 56,
                ...(simpleIconColor && { background: simpleIconColor })
              }}
            >
              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: "256px 256px",
                }}
              />

              {/* Additional inner shadow for depth */}
              <div
                className="absolute inset-0 rounded-md"
                style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)" }}
              />

              {/* Letter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-silkscreen text-primary-foreground select-none"
                  style={{
                    fontSize: 24,
                    // textShadow: "0 1px 4px rgba(255,255,255,0.3), 0 0 8px rgba(255,255,255,0.2)",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Subtle highlight on top */}
              <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            {/* License and Open Source Info below title */}
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span>{isOpenSource ? "Open Source" : "Proprietary"}</span>
              </div>
              
              {/* Middle Intersect */}
              ∙ 
              {license && (
                <div className="flex items-center gap-1.5">
                  <span>{license}</span>
                </div>
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
                      className="w-full h-full rounded-sm flex items-center justify-center text-white font-silkscreen"
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

      {/* Feature Details with StatusBadge as Trigger */}
      {displayFeatures.length > 0 && totalFeatures && totalFeatures > 0 && (
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
                  value={displayFeatures.filter(f => f.compatible !== false).length}
                  total={totalFeatures}
                  size={16}
                  strokeWidth={2}
                />
                {`${displayFeatures.filter(f => f.compatible !== false).length}/${totalFeatures}`}
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                {`${compatibilityScore || 0}%`}
              </span>
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
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {displayFeatures
                .slice(0, showAllFeatures ? displayFeatures.length : 8)
                .sort((a, b) => {
                  // Sort compatible features first
                  const aCompatible = a.compatible !== false;
                  const bCompatible = b.compatible !== false;
                  if (aCompatible && !bCompatible) return -1;
                  if (!aCompatible && bCompatible) return 1;
                  return 0;
                })
                .map((feature, index) => (
                  <FeatureDonut 
                    key={index} 
                    feature={feature}
                    onClick={() => onFeatureClick?.(feature.name)}
                    isSelected={selectedFeatures.includes(feature.name)}
                  />
                ))}
              {!showAllFeatures && displayFeatures.length > 8 && (
                <div 
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-muted/30 text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllFeatures(true);
                  }}
                >
                  <span className="font-medium text-muted-foreground">
                    +{displayFeatures.length - 8} more features
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