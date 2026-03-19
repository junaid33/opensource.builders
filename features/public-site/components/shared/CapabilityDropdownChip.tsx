"use client";

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, Check } from 'lucide-react';
import ToolIcon from '@/components/ToolIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CapabilityDropdownChipProps {
  capability: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category?: string;
    complexity?: string;
  };
  openSourceAppId: string;
  openSourceAppName: string;
  isSelected: boolean;
  onToggle: (data: any) => void;
  apps?: any[];
  toolIcon?: string;
  toolColor?: string;
  toolRepo?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
}

export function CapabilityDropdownChip({
  capability,
  openSourceAppId,
  openSourceAppName,
  isSelected,
  onToggle,
  apps = [],
  toolIcon,
  toolColor,
  toolRepo,
  isActive = true,
  isHighlighted = false,
  implementationNotes,
  githubPath,
  documentationUrl,
}: CapabilityDropdownChipProps) {
  const router = useRouter();

  // Find other apps with this capability
  const otherAppsWithCap = apps
    .filter(
      (a) =>
        a.id !== openSourceAppId &&
        a.capabilities?.some((c: any) => c.capability.id === capability.id)
    )
    .slice(0, 3); // Show max 3 other apps directly in the dropdown

  const showActiveRing = isSelected || isHighlighted;

  const handleToggle = () => {
    onToggle({
      id: `${openSourceAppId}-${capability.id}`,
      capabilityId: capability.id,
      toolId: openSourceAppId,
      name: capability.name,
      description: capability.description,
      category: capability.category,
      complexity: capability.complexity,
      toolName: openSourceAppName,
      toolIcon: toolIcon,
      toolColor: toolColor,
      toolRepo: toolRepo,
      implementationNotes,
      githubPath,
      documentationUrl,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'relative flex items-center gap-2 h-9 px-3 text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus:ring-1 focus:ring-muted',
            showActiveRing
              ? 'text-foreground bg-accent border-border/60'
              : isActive
              ? 'text-muted-foreground bg-secondary border-border hover:text-foreground hover:bg-accent'
              : 'text-muted-foreground/40 bg-secondary/50 border-border/50 line-through',
            'active:scale-95 rounded-none shrink-0' // Force no roundedness, prevent shrinking
          )}
        >
          {showActiveRing && (
            <>
              <span className="absolute top-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-t border-foreground z-10" />
              <span className="absolute top-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-t border-foreground z-10" />
              <span className="absolute bottom-[-1px] right-[-1px] w-[4px] h-[4px] border-r border-b border-foreground z-10" />
              <span className="absolute bottom-[-1px] left-[-1px] w-[4px] h-[4px] border-l border-b border-foreground z-10" />
            </>
          )}

          <ToolIcon
            name={openSourceAppName}
            simpleIconSlug={toolIcon}
            simpleIconColor={toolColor}
            size={14}
            rounded="none"
            dotOnly={!toolIcon}
            className="shrink-0"
          />

          <span className="truncate max-w-[120px] sm:max-w-[150px]">{capability.name}</span>
          <ChevronDown className="w-3 h-3 opacity-30 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[300px] border-border bg-background rounded-none">
        <DropdownMenuLabel className="font-instrument-serif text-lg font-normal mb-1 flex items-center gap-2">
          <ToolIcon
            name={openSourceAppName}
            simpleIconSlug={toolIcon}
            simpleIconColor={toolColor}
            size={20}
            rounded="none"
          />
          {capability.name}
        </DropdownMenuLabel>

        {otherAppsWithCap.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <div className="px-2 py-1.5 text-xs text-muted-foreground/80 font-mono uppercase tracking-wider">
              Used by
            </div>
            <DropdownMenuGroup>
              {otherAppsWithCap.map((app) => (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => router.push(`/os-alternatives/${app.slug}`)}
                  className="text-sm cursor-pointer rounded-none"
                >
                  <ToolIcon
                    name={app.name}
                    simpleIconSlug={app.simpleIconSlug}
                    simpleIconColor={app.simpleIconColor}
                    size={16}
                    rounded="none"
                    className="mr-2"
                  />
                  {app.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => router.push(`/capabilities/${capability.slug}`)}
                className="text-sm text-foreground/60 cursor-pointer pt-2 rounded-none"
              >
                View all applications →
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="bg-border" />
        
        {(implementationNotes || githubPath || documentationUrl) && (
          <>
            <div className="px-2 py-2 space-y-2 text-[0.7rem]">
              {implementationNotes && (
                <div>
                  <p className="text-muted-foreground uppercase text-[0.6rem] font-mono mb-1">Notes</p>
                  <p className="text-foreground/80 leading-relaxed">{implementationNotes}</p>
                </div>
              )}
              {githubPath && (
                <div>
                  <p className="text-muted-foreground uppercase text-[0.6rem] font-mono mb-1">Code Location</p>
                  <code className="bg-muted px-1.5 py-0.5 border border-border text-foreground/70 break-all block font-mono">
                    {githubPath}
                  </code>
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="bg-border" />
          </>
        )}

        <DropdownMenuItem
          onClick={handleToggle}
          className={cn(
            'cursor-pointer text-sm font-medium rounded-none',
            isSelected ? 'text-red-400 focus:text-red-500 focus:bg-red-500/10' : 'text-foreground focus:bg-accent'
          )}
        >
          {isSelected ? (
            <>
              <Check className="w-3 h-3 mr-2" />
              Added to Skill Builder
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 mr-2" />
              Create skill from feature
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
