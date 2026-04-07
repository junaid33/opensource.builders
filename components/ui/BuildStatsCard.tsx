"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolIcon from '@/components/ToolIcon';
import { useBuildStatsCardState, useCapabilityActions } from '@/hooks/use-capabilities-config';

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
}: BuildStatsCardProps) {
  const { addCapability, removeCapability } = useCapabilityActions();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter apps based on search
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return apps.slice(0, 10); // Show top 10 by default
    const q = searchTerm.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(q) || 
      app.description?.toLowerCase().includes(q)
    );
  }, [apps, searchTerm]);

  // Filter capabilities based on search
  // A capability item is a pair of {app, capabilityImpl}
  const filteredCapabilities = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const result: { app: OpenSourceApp; impl: CapabilityImpl }[] = [];
    
    apps.forEach(app => {
      app.capabilities.forEach(impl => {
        const matchesCapability = impl.capability.name.toLowerCase().includes(q);
        const matchesApp = app.name.toLowerCase().includes(q);
        
        if (q === "" || matchesCapability || matchesApp) {
          result.push({ app, impl });
        }
      });
    });

    // If search is empty, just show some default ones or none?
    // Let's show first 30
    return result.slice(0, 30);
  }, [apps, searchTerm]);

  const [expandedCap, setExpandedCap] = useState<string | null>(null);

  const handleToggle = (app: OpenSourceApp, impl: CapabilityImpl) => {
    const compositeId = `${app.id}-${impl.capability.id}`;
    if (externalSelectedCapabilities?.has(compositeId)) {
      removeCapability(compositeId);
    } else {
      addCapability({
        id: compositeId,
        capabilityId: impl.capability.id,
        toolId: app.id,
        name: impl.capability.name,
        description: impl.capability.description,
        category: impl.capability.category,
        complexity: impl.capability.complexity,
        toolName: app.name,
        toolIcon: app.simpleIconSlug,
        toolColor: app.simpleIconColor,
        toolRepo: app.repositoryUrl,
        implementationNotes: impl.implementationNotes,
        githubPath: impl.githubPath,
        documentationUrl: impl.documentationUrl
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-background">
      {/* Search Input */}
      <div className="relative group/search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-foreground transition-colors" />
        <input
          type="text"
          placeholder="Search applications or capabilities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 pl-10 pr-4 text-sm bg-secondary border border-border text-foreground outline-none transition-all duration-200 focus:ring-1 focus:ring-muted rounded-none"
        />
      </div>

      {/* Tier 1: Open Source Applications */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Applications
        </p>
        <div className="flex flex-wrap gap-2">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => setSearchTerm(app.name)}
                className="flex items-center gap-2 h-8 px-3 text-[0.75rem] font-medium bg-secondary border border-border hover:bg-accent hover:border-border/60 transition-all rounded-none"
              >
                <ToolIcon
                  name={app.name}
                  simpleIconSlug={app.simpleIconSlug}
                  simpleIconColor={app.simpleIconColor}
                  size={14}
                  rounded="none"
                />
                <span>{app.name}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No apps found</span>
          )}
        </div>
      </div>

      {/* Tier 2: Capabilities */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Capabilities
        </p>
        <div className="flex flex-col gap-2">
          {filteredCapabilities.length > 0 ? (
            filteredCapabilities.map(({ app, impl }) => {
              const compositeId = `${app.id}-${impl.capability.id}`;
              const isSelected = externalSelectedCapabilities?.has(compositeId);
              const isExpanded = expandedCap === compositeId;

              return (
                <div key={compositeId} className="flex flex-col gap-0">
                  <div
                    className={cn(
                      "group flex items-center gap-3 p-2 text-left border transition-all duration-200 rounded-none cursor-pointer",
                      isSelected 
                        ? "bg-accent border-border/60" 
                        : "bg-secondary border-border hover:bg-accent/50 hover:border-border/60"
                    )}
                    onClick={() => setExpandedCap(isExpanded ? null : compositeId)}
                  >
                    <ToolIcon
                      name={app.name}
                      simpleIconSlug={app.simpleIconSlug}
                      simpleIconColor={app.simpleIconColor}
                      size={24}
                      rounded="none"
                      dotOnly={!app.simpleIconSlug}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.75rem] font-medium truncate group-hover:text-foreground transition-colors">
                        {impl.capability.name}
                      </div>
                      <div className="text-[0.65rem] text-muted-foreground truncate italic">
                        from {app.name}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(app, impl);
                      }}
                      className={cn(
                        "flex items-center justify-center size-6 shrink-0 transition-all",
                        isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-3 bg-secondary/30 border-x border-b border-border/40 text-[0.7rem] space-y-2 animate-in slide-in-from-top-1 duration-200">
                      {impl.implementationNotes && (
                        <div>
                          <p className="text-muted-foreground uppercase text-[0.6rem] font-mono mb-1">Notes</p>
                          <p className="text-foreground/80 leading-relaxed">{impl.implementationNotes}</p>
                        </div>
                      )}
                      {impl.githubPath && (
                        <div>
                          <p className="text-muted-foreground uppercase text-[0.6rem] font-mono mb-1">Code Location</p>
                          <code className="bg-muted px-1.5 py-0.5 border border-border text-foreground/70 break-all block font-mono text-[0.65rem]">
                            {impl.githubPath}
                          </code>
                        </div>
                      )}
                      {!impl.implementationNotes && !impl.githubPath && (
                        <p className="text-muted-foreground italic">No implementation details available.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-xs text-muted-foreground">No capabilities found</span>
          )}
        </div>
      </div>
    </div>
  );
}