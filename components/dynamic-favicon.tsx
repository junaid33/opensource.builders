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
  // Use SimpleIcons instead of Google favicon
  const getSimpleIconUrl = (toolName: string) => {
    // For now, hardcode to shopify as requested
    return `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/shopify.svg`;
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

  const iconUrl = getSimpleIconUrl(toolName);
  const initials = getInitials(toolName);

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={`${toolName} icon`}
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