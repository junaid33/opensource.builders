'use client'

import { ReactNode, useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div 
        className="flex animate-infinite-scroll hover:animate-infinite-scroll-slow"
        style={{
          gap: `${gap}px`,
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
  animation: infinite-scroll 40s linear infinite;
  transition: animation-duration 0.3s ease-in-out;
}

.animate-infinite-scroll-slow {
  animation: infinite-scroll 20s linear infinite;
  transition: animation-duration 0.3s ease-in-out;
}
`