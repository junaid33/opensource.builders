'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface InfiniteSliderProps {
  children: ReactNode[]
  speed?: number
  speedOnHover?: number
  gap?: number
  className?: string
}

export function InfiniteSlider({ 
  children, 
  speed = 40, 
  speedOnHover = 20, 
  gap = 40,
  className = '' 
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentSpeed = isHovered ? speedOnHover : speed

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex animate-infinite-scroll"
        style={{
          gap: `${gap}px`,
          animationDuration: `${currentSpeed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {/* First set of children */}
        {children.map((child, index) => (
          <div key={`first-${index}`} className="flex-shrink-0">
            {child}
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {children.map((child, index) => (
          <div key={`second-${index}`} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// Add this to your global CSS
export const infiniteSliderCSS = `
@keyframes infinite-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-infinite-scroll {
  animation: infinite-scroll linear infinite;
}
`