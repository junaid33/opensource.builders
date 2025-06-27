'use client';

import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, Check, X, Globe, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { MiniDonutChart } from '@/components/ui/mini-donut-chart';
import { cn } from '@/lib/utils';
import { resolveToolLogo, generateLetterAvatarSvg } from '@/features/keystone/utils/logo-resolver';

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
  logoSvg?: string;
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
  logoSvg,
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
  const [resolvedAlternatives, setResolvedAlternatives] = useState<Array<Alternative & { resolvedLogo?: string }>>([]);

  // Use legacy props if new ones aren't provided
  const displayName = name || title || "Unknown Tool";
  const displayStars = githubStars || starCount || 0;
  const displayFeatures = features.length > 0 ? features : 
    (featuresCount ? Array.from({ length: featuresCount }, (_, i) => ({ 
      name: `Feature ${i + 1}`, 
      compatible: true,
      featureType: undefined
    })) : []);

  // Resolve logos for alternatives
  useEffect(() => {
    const resolveAlternativeLogos = async () => {
      const resolved = await Promise.all(
        alternatives.map(async (alt) => {
          try {
            const logoResult = await resolveToolLogo({
              name: alt.name,
              logoSvg: alt.logoSvg,
              websiteUrl: alt.websiteUrl
            });
            
            let resolvedLogo = '';
            if (logoResult.type === 'svg') {
              resolvedLogo = logoResult.data;
            } else if (logoResult.type === 'favicon' || logoResult.type === 'url') {
              resolvedLogo = `<img src="${logoResult.data}" alt="${alt.name}" width="12" height="12" />`;
            } else if (logoResult.type === 'letter') {
              resolvedLogo = generateLetterAvatarSvg(logoResult.data, 12);
            }
            
            return { ...alt, resolvedLogo };
          } catch (error) {
            // Fallback to letter avatar
            const letter = alt.name.charAt(0).toUpperCase();
            return { 
              ...alt, 
              resolvedLogo: generateLetterAvatarSvg(letter, 12)
            };
          }
        })
      );
      setResolvedAlternatives(resolved);
    };

    if (alternatives.length > 0) {
      resolveAlternativeLogos();
    }
  }, [alternatives]);

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
          {logoSvg && (
            <div 
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: logoSvg }}
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </h3>
          </div>
        </div>
        
        {/* Top Right Stats and Website Link */}
        <div className="flex items-center gap-2">
          {displayStars > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4" />
              <span className="font-medium">{formatStars(displayStars)}</span>
            </div>
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

      {/* License and Open Source Info with Intersect */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
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

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {description}
      </p>

      {/* Alternatives Section with Resolved Logos */}
      {resolvedAlternatives.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Alternative to</p>
          <div className="flex flex-wrap gap-1">
            {resolvedAlternatives.slice(0, 3).map((alt, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-0.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-sm bg-gray-100 flex items-center justify-center overflow-hidden">
                  {alt.resolvedLogo ? (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: alt.resolvedLogo }}
                    />
                  ) : (
                    <span className="text-gray-600 text-[8px] font-medium">
                      {alt.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-20">{alt.name}</span>
              </div>
            ))}
            {resolvedAlternatives.length > 3 && (
              <div className="px-2 py-0.5 text-xs text-muted-foreground">
                +{resolvedAlternatives.length - 3} more
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