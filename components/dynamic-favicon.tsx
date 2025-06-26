'use client';

import { cn } from '@/lib/utils';

interface DynamicFaviconProps {
  websiteUrl?: string;
  toolName: string;
  className?: string;
  fallbackToInitials?: boolean;
}

export function DynamicFavicon({ 
  websiteUrl, 
  toolName, 
  className,
  fallbackToInitials = false 
}: DynamicFaviconProps) {
  // Extract domain from URL for favicon
  const getFaviconUrl = (url?: string) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  // Generate initials fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const faviconUrl = getFaviconUrl(websiteUrl);
  const initials = getInitials(toolName);

  if (faviconUrl) {
    return (
      <img
        src={faviconUrl}
        alt={`${toolName} favicon`}
        className={cn("object-cover", className)}
        onError={(e) => {
          if (fallbackToInitials) {
            // Replace with initials div on error
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="${className} bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                  ${initials}
                </div>
              `;
            }
          }
        }}
      />
    );
  }

  // Fallback to initials
  return (
    <div className={cn(
      "bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium",
      className
    )}>
      {initials}
    </div>
  );
}