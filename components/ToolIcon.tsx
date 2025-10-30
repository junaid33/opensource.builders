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
  // If we have a SimpleIcon slug, use it with enhanced styling
  if (simpleIconSlug) {
    const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${simpleIconSlug}.svg`
    
    return (
      <div 
        className={`flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none ${className}`}
        style={{ 
          width: size, 
          height: size,
          background: simpleIconColor || '#000000'
        }}
      >
        {/* Noise texture overlay for SimpleIcons too */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
        
        <img
          src={iconUrl}
          alt={`${name} icon`}
          className="relative z-10"
          style={{ 
            width: size * 0.55, 
            height: size * 0.55,
            filter: 'brightness(0) invert(1)',
            opacity: 0.9
          }}
        />
        
        {/* Subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
      </div>
    )
  }

  // Enhanced fallback with grainy background effect
  const firstLetter = name.charAt(0).toUpperCase()
  
  // Use simpleIconColor if available, otherwise default to black
  let backgroundColor = simpleIconColor || '#000000'
  
  return (
    <div 
      className={`flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size,
        background: backgroundColor
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
          className="font-instrument-serif font-bold text-foreground select-none"
          style={{
            fontSize: size * 0.45,
            textShadow: "0 1px 4px rgba(255,255,255,0.3), 0 0 8px rgba(255,255,255,0.2)",
            filter: 'brightness(0) invert(1)',
            opacity: 0.9
          }}
        >
          {firstLetter}
        </span>
      </div>

      {/* Subtle highlight on top */}
      <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
    </div>
  )
}