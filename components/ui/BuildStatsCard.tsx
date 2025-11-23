"use client";

import { useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { ChevronLeft, ChevronRight, Plus, Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ToolIcon from '@/components/ToolIcon';
import { useBuildStatsCardState, useCapabilityActions } from '@/hooks/use-capabilities-config';
import { DonutChart } from '@/components/ui/shared-donut-chart';
import starterAppsConfig from '@/config/starter-apps.json';


interface Capability {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  complexity?: string;
}

interface CapabilityImpl {
  capability: Capability;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity?: string;
  isActive?: boolean;
}

interface CapabilityItem {
  name: string;
  category: string;
  percentage: number;
  compatible: boolean;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity?: string;
  description?: string;
  complexity?: string;
}

interface OpenSourceApp {
  id: string;
  name: string;
  slug: string;
  description?: string;
  repositoryUrl?: string;
  websiteUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities: CapabilityImpl[];
}


interface BuildStatsCardProps {
  apps: OpenSourceApp[];
  selectedCapabilities?: Set<string>;
  selectedStarterId?: string;
}


export default function BuildStatsCard({
  apps,
  selectedCapabilities: externalSelectedCapabilities,
  selectedStarterId
}: BuildStatsCardProps) {
  // Get all state from global context
  const { buildStatsCard, updateBuildStatsCard } = useBuildStatsCardState();
  const { addCapability, removeCapability } = useCapabilityActions();
  
  const { currentAppIndex, isCollapsed, capabilitySearch, appSearchTerm, isAppsDropdownOpen } = buildStatsCard;
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const appSearchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        updateBuildStatsCard({ isAppsDropdownOpen: false })
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [updateBuildStatsCard])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        updateBuildStatsCard({ isAppsDropdownOpen: false })
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [updateBuildStatsCard])

  // Organize apps: prioritize apps built with the selected starter
  const organizedApps = useMemo(() => {
    const starterConfig = selectedStarterId ? starterAppsConfig[selectedStarterId as keyof typeof starterAppsConfig] : null;

    if (!starterConfig) {
      return apps;
    }

    const starterAppSlugs = new Set(starterConfig.appSlugs);
    const builtWithStarter = apps.filter(app => starterAppSlugs.has(app.slug));
    const otherApps = apps.filter(app => !starterAppSlugs.has(app.slug));

    return [...builtWithStarter, ...otherApps];
  }, [apps, selectedStarterId]);

  // TODO: Consider moving filtering to GraphQL where clause or implementing search index (FlexSearch)
  // Currently doing client-side filtering - could be improved with proper search index like in OpenFront
  // Filter apps based on search
  const filteredApps = appSearchTerm.trim()
    ? organizedApps.filter(app =>
        app.name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.description?.toLowerCase().includes(appSearchTerm.toLowerCase())
      )
    : organizedApps;

  // Ensure currentAppIndex is within bounds (use organizedApps)
  const safeCurrentAppIndex = Math.max(0, Math.min(currentAppIndex, organizedApps.length - 1));
  const currentApp = organizedApps[safeCurrentAppIndex];
  
  // If the index changed due to bounds checking, update it
  if (safeCurrentAppIndex !== currentAppIndex) {
    updateBuildStatsCard({ currentAppIndex: safeCurrentAppIndex });
  }

  const handleAppChange = (newIndex: number) => {
    updateBuildStatsCard({ 
      currentAppIndex: newIndex, 
      capabilitySearch: '' 
    });
  };

  const nextApp = () => {
    const newIndex = (currentAppIndex + 1) % organizedApps.length;
    handleAppChange(newIndex);
  };

  const prevApp = () => {
    const newIndex = (currentAppIndex - 1 + organizedApps.length) % organizedApps.length;
    handleAppChange(newIndex);
  };

  const toggleAppsDropdown = () => {
    const newIsOpen = !isAppsDropdownOpen;
    updateBuildStatsCard({ isAppsDropdownOpen: newIsOpen });
    
    // Focus search input when dropdown opens
    if (newIsOpen) {
      setTimeout(() => {
        appSearchRef.current?.focus();
      }, 0);
    } else {
      updateBuildStatsCard({ appSearchTerm: '' });
    }
  };

  const selectApp = (app: OpenSourceApp) => {
    const originalIndex = organizedApps.findIndex(a => a.id === app.id);
    if (originalIndex !== -1) {
      handleAppChange(originalIndex);
    }
    updateBuildStatsCard({
      appSearchTerm: '',
      isAppsDropdownOpen: false
    });
  };

  const handlePinCapability = (capability: CapabilityItem) => {
    const currentApp = organizedApps[currentAppIndex];
    if (!currentApp) return;
    
    const capabilityImpl = currentApp.capabilities.find(
      capImpl => capImpl.capability.name === capability.name
    );
    
    if (!capabilityImpl) return;

    const compositeId = `${currentApp.id}-${capabilityImpl.capability.id}`;
    const selectedCapability = {
      id: compositeId,
      capabilityId: capabilityImpl.capability.id,
      toolId: currentApp.id,
      name: capabilityImpl.capability.name,
      description: capabilityImpl.capability.description,
      category: capabilityImpl.capability.category,
      complexity: capabilityImpl.capability.complexity,
      toolName: currentApp.name,
      toolIcon: currentApp.simpleIconSlug,
      toolColor: currentApp.simpleIconColor,
      toolRepo: currentApp.repositoryUrl,
      implementationNotes: capabilityImpl.implementationNotes,
      githubPath: capabilityImpl.githubPath,
      documentationUrl: capabilityImpl.documentationUrl
    };
    
    if (externalSelectedCapabilities?.has(compositeId)) {
      removeCapability(compositeId);
    } else {
      addCapability(selectedCapability, organizedApps);
    }
  };

  // No apps state
  if (!apps || apps.length === 0) {
    return (
      <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
        <div className="relative flex flex-col space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-foreground">No Applications</h3>
              <p className="text-xs text-muted-foreground font-medium">
                No open source applications found
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform capabilities data for current app
  const capabilityData: CapabilityItem[] = currentApp.capabilities.map(capImpl => ({
    name: capImpl.capability.name,
    category: capImpl.capability.category || 'other',
    percentage: 100, // Always 100% for open source
    compatible: true, // Open source is always compatible
    implementationNotes: capImpl.implementationNotes,
    githubPath: capImpl.githubPath,
    documentationUrl: capImpl.documentationUrl,
    implementationComplexity: capImpl.implementationComplexity,
    description: capImpl.capability.description,
    complexity: capImpl.capability.complexity,
  }));

  const compatibleCount = capabilityData.length; // All are compatible
  const totalCount = capabilityData.length;
  const compatibilityScore = 100; // 100% compatibility for open source

  return (
    <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
      <div className="relative flex flex-col space-y-2">
        {/* Header in the outer gray card */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left side: Logo and capabilities info */}
          <div className="flex items-center gap-2 flex-1 min-w-0" ref={dropdownRef}>
            <ToolIcon
              name={currentApp.name}
              simpleIconSlug={currentApp.simpleIconSlug}
              simpleIconColor={currentApp.simpleIconColor}
              size={32}
            />
            
            {/* Custom dropdown trigger */}
            <div className="relative flex-1 min-w-0">
              <div className="flex flex-col items-start min-w-0">
                <button
                  onClick={toggleAppsDropdown}
                  className="flex items-center gap-1 text-left"
                >
                  <h3 className="text-sm font-medium text-foreground truncate">{currentApp.name}</h3>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                      isAppsDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {compatibleCount} Capabilities
                  </p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateBuildStatsCard({ isCollapsed: !isCollapsed })
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </button>
                </div>
              </div>

              {/* Custom dropdown */}
              {isAppsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 max-h-96 rounded-lg border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg z-50">
                  <div className="p-2">
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Switch to other open source app
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        ref={appSearchRef}
                        type="search"
                        placeholder="Search applications..."
                        className="pl-9 pr-3 h-9 text-sm"
                        value={appSearchTerm}
                        onChange={(e) => updateBuildStatsCard({ appSearchTerm: e.target.value })}
                      />
                    </div>
                    
                    {/* Applications List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {filteredApps.length > 0 ? (
                        (() => {
                          const starterConfig = selectedStarterId ? starterAppsConfig[selectedStarterId as keyof typeof starterAppsConfig] : null;
                          const starterAppSlugs = starterConfig ? new Set(starterConfig.appSlugs) : new Set();
                          const builtWithStarter = filteredApps.filter(app => starterAppSlugs.has(app.slug));
                          const otherApps = filteredApps.filter(app => !starterAppSlugs.has(app.slug));

                          return (
                            <>
                              {/* Built with this starter section */}
                              {starterConfig && builtWithStarter.length > 0 && (
                                <>
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border flex items-center gap-2">
                                    <span>Built with {starterConfig.name}</span>
                                    <span className="inline-flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground px-1.5 py-0.5 text-[10px] font-medium">
                                      {builtWithStarter.length}
                                    </span>
                                  </div>
                                  {builtWithStarter.map((app) => (
                                    <button
                                      key={app.id}
                                      onClick={() => selectApp(app)}
                                      className="w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-muted/50 transition-colors"
                                    >
                                      <ToolIcon
                                        name={app.name}
                                        simpleIconSlug={app.simpleIconSlug}
                                        simpleIconColor={app.simpleIconColor}
                                        size={24}
                                      />
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <div className="text-sm font-medium text-foreground truncate">
                                          {app.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                          {app.capabilities.length} capabilities
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}

                              {/* Other applications section */}
                              {otherApps.length > 0 && (
                                <>
                                  {starterConfig && builtWithStarter.length > 0 && (
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mt-2">
                                      Other Applications ({otherApps.length})
                                    </div>
                                  )}
                                  {otherApps.map((app) => (
                                    <button
                                      key={app.id}
                                      onClick={() => selectApp(app)}
                                      className="w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-muted/50 transition-colors"
                                    >
                                      <ToolIcon
                                        name={app.name}
                                        simpleIconSlug={app.simpleIconSlug}
                                        simpleIconColor={app.simpleIconColor}
                                        size={24}
                                      />
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <div className="text-sm font-medium text-foreground truncate">
                                          {app.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                          {app.capabilities.length} capabilities
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}
                            </>
                          );
                        })()
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {appSearchTerm.trim()
                            ? `No results found for "${appSearchTerm}"`
                            : "No applications available"
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side: Navigation and donut */}
          <div className="flex items-center gap-2">
            {/* Left chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevApp}
              disabled={organizedApps.length <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Right chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={nextApp}
              disabled={organizedApps.length <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Donut chart with popover */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-help">
                  <DonutChart percentage={compatibilityScore} compatible={compatibilityScore === 100} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="bottom" align="end">
                <div className="text-xs">
                  <span className="font-medium">{compatibleCount}/{totalCount} capabilities supported</span>
                  <br />
                  <span className="text-muted-foreground">{compatibilityScore}% compatibility</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Capabilities list in the inner white card */}
        {!isCollapsed && (
          <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 p-2">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search capabilities..."
              className="pl-9 pr-3 h-9 text-sm"
              value={capabilitySearch}
              onChange={(e) => updateBuildStatsCard({ capabilitySearch: e.target.value })}
            />
          </div>
          
          {/* Capabilities list with scroll */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(() => {
              // TODO: Consider implementing search index (FlexSearch) for better capability search
              // Currently doing simple client-side filtering
              const filteredCapabilities = capabilityData.filter((item) => {
                if (!capabilitySearch.trim()) return true;
                return item.name.toLowerCase().includes(capabilitySearch.toLowerCase());
              });

              if (filteredCapabilities.length === 0 && capabilitySearch.trim()) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No capabilities found for "{capabilitySearch}"</p>
                  </div>
                );
              }

              return filteredCapabilities
                .sort((a, b) => {
                  // Sort by pinned first, then by compatible status
                  const aCompositeId = `${currentApp.id}-${currentApp.capabilities.find(c => c.capability.name === a.name)?.capability.id}`;
                  const bCompositeId = `${currentApp.id}-${currentApp.capabilities.find(c => c.capability.name === b.name)?.capability.id}`;
                  const aPinned = externalSelectedCapabilities?.has(aCompositeId) || false;
                  const bPinned = externalSelectedCapabilities?.has(bCompositeId) || false;
                  if (aPinned && !bPinned) return -1;
                  if (!aPinned && bPinned) return 1;
                  // Then sort compatible capabilities first within each group
                  if (a.compatible && !b.compatible) return -1;
                  if (!a.compatible && b.compatible) return 1;
                  return 0;
                })
                .map((item) => {
                const capabilityImpl = currentApp.capabilities.find(c => c.capability.name === item.name);
                const compositeId = capabilityImpl ? `${currentApp.id}-${capabilityImpl.capability.id}` : '';
                const isPinned = externalSelectedCapabilities?.has(compositeId) || false;
                const showPin = item.compatible; // Only show pin for compatible capabilities
                
                return (
                  <div
                    key={`${currentApp.id}-${item.name}-${item.category}`}
                    onClick={showPin ? (e) => {
                      e.preventDefault()
                      handlePinCapability(item)
                    } : undefined}
                    className="group flex items-center justify-between gap-5 rounded-2xl bg-background border p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="rounded-lg p-1 flex-shrink-0">
                        <DonutChart percentage={item.percentage} compatible={item.compatible} isAnimationActive={false} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          {item.githubPath && (
                            <>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    CODE
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-3" side="bottom" align="start">
                                  <span className="text-sm text-muted-foreground break-all">
                                    {item.githubPath}
                                  </span>
                                </PopoverContent>
                              </Popover>
                              <span className="text-muted-foreground">·</span>
                            </>
                          )}
                          {item.documentationUrl && (
                            <>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    DOCS
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-3" side="bottom" align="start">
                                  <a
                                    href={item.documentationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all"
                                  >
                                    {item.documentationUrl}
                                  </a>
                                </PopoverContent>
                              </Popover>
                              <span className="text-muted-foreground">·</span>
                            </>
                          )}
                          {item.implementationNotes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  INFO
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3" side="bottom" align="start">
                                <div className="space-y-3">
                                  <div className="text-sm font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.implementationNotes}
                                  </div>
                                  {item.implementationComplexity && (
                                    <div className="text-xs text-muted-foreground">
                                      <span className="font-medium">Complexity:</span> {item.implementationComplexity}
                                    </div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </div>
                    {showPin && (
                      <div className={`flex items-center justify-center size-8 rounded-full bg-primary flex-shrink-0 transition-opacity duration-250 ${
                        isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <Plus className="size-4 text-primary-foreground stroke-3" />
                      </div>
                    )}
                  </div>
                );
                })
            })()}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}