'use client'

interface ResolvedLogo {
  type: 'svg' | 'url' | 'favicon' | 'letter'
  data: string
  domain?: string
  verified?: boolean
  svg?: string // For letter avatars
}

interface ToolLogoProps {
  name: string
  resolvedLogo?: ResolvedLogo
  size?: number
  className?: string
}

export default function ToolLogo({ 
  name, 
  resolvedLogo, 
  size = 32, 
  className = '' 
}: ToolLogoProps) {
  // Fallback if no resolvedLogo is provided
  if (!resolvedLogo) {
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

  const commonProps = {
    className: `${className}`,
    style: { width: size, height: size }
  }

  switch (resolvedLogo.type) {
    case 'svg':
      return (
        <div 
          {...commonProps}
          dangerouslySetInnerHTML={{ __html: resolvedLogo.data }}
        />
      )

    case 'url':
      return (
        <img
          {...commonProps}
          src={resolvedLogo.data}
          alt={`${name} logo`}
          loading="lazy"
        />
      )

    case 'favicon':
      return (
        <img
          {...commonProps}
          src={resolvedLogo.data}
          alt={`${name} favicon`}
          loading="lazy"
          onError={(e) => {
            // If favicon fails to load, replace with letter avatar
            const target = e.target as HTMLImageElement
            const letter = name.charAt(0).toUpperCase()
            target.style.display = 'none'
            
            // Create letter avatar as fallback
            const letterDiv = document.createElement('div')
            letterDiv.className = `flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold ${className}`
            letterDiv.style.width = `${size}px`
            letterDiv.style.height = `${size}px`
            letterDiv.style.fontSize = `${size * 0.4}px`
            letterDiv.textContent = letter
            
            target.parentNode?.insertBefore(letterDiv, target)
          }}
        />
      )

    case 'letter':
      if (resolvedLogo.svg) {
        return (
          <div 
            {...commonProps}
            dangerouslySetInnerHTML={{ __html: resolvedLogo.svg }}
          />
        )
      }
      
      // Fallback to CSS letter avatar
      return (
        <div 
          className={`flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {resolvedLogo.data}
        </div>
      )

    default:
      // Ultimate fallback
      const firstLetter = name.charAt(0).toUpperCase()
      return (
        <div 
          className={`flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {firstLetter}
        </div>
      )
  }
}