'use client';

import React from 'react';
import { Star, Globe, Github, ArrowUpRight, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { DynamicFavicon } from '@/components/dynamic-favicon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DisplayCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  meta?: string;
  starCount?: number;
  alternatives?: Array<{
    name: string;
    icon?: string;
  }>;
  toolsCount?: number;
  featuresCount?: number;
  flowsCount?: number;
  websiteUrl?: string;
  repositoryUrl?: string;
  toolSlug?: string;
  className?: string;
  isSelected?: boolean;
  logoSvg?: string;
  license?: string;
  compatibilityScore?: number;
  totalFeatures?: number;
  missingFeatures?: number;
  features?: Array<{
    name: string;
    featureType?: string;
  }>;
}

// Generate a consistent color for each tool name
const generateToolColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500',
    'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
    'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-sky-500', 'bg-fuchsia-500', 'bg-slate-500'
  ];
  
  // Generate a consistent index based on the tool name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function DisplayCard({ 
  icon, 
  title, 
  description, 
  meta, 
  starCount, 
  alternatives = [],
  featuresCount = 0,
  flowsCount = 0,
  websiteUrl,
  repositoryUrl,
  toolSlug,
  className,
  isSelected = false,
  logoSvg,
  license,
  compatibilityScore,
  totalFeatures,
  missingFeatures,
  features = []
}: DisplayCardProps) {
  const formatStars = (stars: number) => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  return (
    <div
      className={cn(
        "group relative p-1 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 w-full",
        "shadow-black-950/10 bg-zinc-100/80 border",
        "border-gray-300 dark:border-gray-700 ring-2 ring-gray-300/50 dark:ring-gray-600/50",
        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
        "cursor-pointer",
        className
      )}
    >
      <div className="relative flex flex-col">
        <div className="space-y-2 ring-foreground/5 text-card-foreground rounded-lg bg-card dark:bg-card border shadow border-transparent ring-1 ring-foreground/5 p-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center font-medium text-foreground dark:text-foreground tracking-tight text-[15px]">
              <div className="mr-3">
                {logoSvg ? (
                  <div 
                    className="w-8 h-8 rounded-sm flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: logoSvg }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-sm bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                    {title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span>{title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Open Source
                  </span>
                  {license && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {license}
                    </span>
                  )}
                </div>
              </div>
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground dark:text-muted-foreground font-[425] line-clamp-2 leading-relaxed">
            {description}
          </p>


          {/* Alternatives Section */}
          {alternatives.length > 0 && (
            <div className="pt-1">
              <p className="text-xs text-muted-foreground mb-1">Alternative to:</p>
              <div className="flex flex-wrap gap-1">
                {alternatives.slice(0, 3).map((alt, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-0.5 bg-muted/50 dark:bg-muted/30 rounded text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-sm bg-gray-300 text-gray-600 flex items-center justify-center text-[8px] font-medium">
                      {alt.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-16">{alt.name}</span>
                  </div>
                ))}
                {alternatives.length > 3 && (
                  <div className="px-2 py-0.5 bg-muted/50 dark:bg-muted/30 rounded text-xs text-muted-foreground">
                    +{alternatives.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {/* Features Badge with Donut Chart */}
            {featuresCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-2 py-0.5 rounded-full text-xs bg-muted/40 dark:bg-muted/30 text-muted-foreground border border-border cursor-help">
                    {compatibilityScore !== undefined && totalFeatures !== undefined ? (
                      <div className="relative w-4 h-4">
                        <svg className="w-4 h-4 transform -rotate-90">
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-300"
                          />
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(compatibilityScore / 100) * 37.7} 37.7`}
                            strokeLinecap="round"
                            className="text-green-500 transition-all duration-300 ease-in-out"
                          />
                        </svg>
                      </div>
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    <span className="text-[10px] font-medium">{featuresCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark py-3 z-50 max-w-sm" side="top" align="start" sideOffset={8}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium">Features ({featuresCount})</p>
                      {compatibilityScore !== undefined && (
                        <span className="text-xs text-green-400">{compatibilityScore}%</span>
                      )}
                    </div>
                    {features.length > 0 ? (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {features.slice(0, 8).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature.name}</span>
                          </div>
                        ))}
                        {features.length > 8 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{features.length - 8} more features
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs max-w-48">
                        Verified features and capabilities
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Star Count */}
            {starCount && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-muted/40 dark:bg-muted/30 text-muted-foreground border border-border cursor-help">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-medium">{formatStars(starCount)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top" sideOffset={8}>
                  <p>GitHub Stars</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {websiteUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                    asChild
                  >
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-3 h-3 text-muted-foreground" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top" sideOffset={8}>
                  <p>Visit Website</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {repositoryUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                    asChild
                  >
                    <a
                      href={repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3 text-muted-foreground" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top" sideOffset={8}>
                  <p>View Repository</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {toolSlug && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                    asChild
                  >
                    <a
                      href={`/tools/${toolSlug}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top" sideOffset={8}>
                  <p>View Details</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        } transition-opacity duration-300`}
      />
    </div>
  );
}