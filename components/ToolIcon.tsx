'use client'

interface ToolIconProps {
  name: string
  simpleIconSlug?: string
  simpleIconColor?: string
  size?: number
  className?: string
}

export default function ToolIcon({ 
  name, 
  simpleIconSlug,
  simpleIconColor,
  size = 32, 
  className = '' 
}: ToolIconProps) {
  // If we have a SimpleIcon slug, use it
  if (simpleIconSlug) {
    const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${simpleIconSlug}.svg`
    
    return (
      <img
        src={iconUrl}
        alt={`${name} icon`}
        className={className}
        style={{ 
          width: size, 
          height: size,
          filter: simpleIconColor ? `brightness(0) saturate(100%)` : undefined,
          color: simpleIconColor || undefined
        }}
      />
    )
  }

  // Fallback to letter avatar
  const firstLetter = name.charAt(0).toUpperCase()
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {firstLetter}
    </div>
  )
}