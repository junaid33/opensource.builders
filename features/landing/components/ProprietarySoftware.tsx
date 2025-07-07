'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import useMeasure from 'react-use-measure'
import ToolIcon from '@/components/ToolIcon'


// InfiniteSlider component implementation with user control
function InfiniteSlider({
  children,
  gap = 16,
  speed = 25,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
}) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const [isUserControlled, setIsUserControlled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let controls;
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    
    // Calculate duration based on speed (higher speed = lower duration)
    const duration = contentSize / currentSpeed;

    // Don't animate if user is controlling the slider
    if (isUserControlled || isDragging) {
      return;
    }

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: duration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    isUserControlled,
    isDragging,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          if (!isUserControlled && !isDragging) {
            setIsTransitioning(true);
            setCurrentSpeed(speedOnHover);
          }
        },
        onHoverEnd: () => {
          if (!isUserControlled && !isDragging) {
            setIsTransitioning(true);
            setCurrentSpeed(speed);
          }
        },
      }
    : {};

  const handleDragStart = () => {
    setIsDragging(true);
    setIsUserControlled(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Resume auto-scroll after 3 seconds of no interaction
    setTimeout(() => {
      setIsUserControlled(false);
      setKey((prevKey) => prevKey + 1);
    }, 3000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsUserControlled(true);
    
    const delta = direction === 'horizontal' ? e.deltaX || e.deltaY : e.deltaY;
    const currentPos = translation.get();
    const newPos = currentPos - delta;
    
    // Constrain movement to content bounds
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const minPos = -contentSize / 2;
    const maxPos = 0;
    
    const constrainedPos = Math.max(minPos, Math.min(maxPos, newPos));
    translation.set(constrainedPos);
    
    // Resume auto-scroll after 3 seconds of no wheel activity
    setTimeout(() => {
      setIsUserControlled(false);
      setKey((prevKey) => prevKey + 1);
    }, 3000);
  };

  return (
    <div 
      className={cn('overflow-hidden cursor-grab active:cursor-grabbing', className)}
      onWheel={handleWheel}
    >
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        drag={direction === 'horizontal' ? 'x' : 'y'}
        dragConstraints={{
          left: direction === 'horizontal' ? -(width + gap) / 2 : 0,
          right: 0,
          top: direction === 'vertical' ? -(height + gap) / 2 : 0,
          bottom: 0,
        }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Progressive blur effect for the edges
function ProgressiveBlur({
  direction = 'left',
  blurIntensity = 1,
  className,
}: {
  direction?: 'left' | 'right';
  blurIntensity?: number;
  className?: string;
}) {
  const gradientDirection = direction === 'left' ? 'to right' : 'to left';
  
  return (
    <div
      className={cn('absolute inset-y-0 w-20 pointer-events-none', className)}
      style={{
        [direction]: 0,
        background: `linear-gradient(${gradientDirection}, hsl(var(--muted) / ${blurIntensity * 0.5}) 0%, hsl(var(--muted) / 0) 100%)`,
      }}
    />
  );
}


interface ProprietarySoftwareProps {
  onSoftwareSelect?: (toolSlug: string, toolName: string) => void
  proprietaryTools?: Array<{
    id: string, 
    name: string, 
    slug: string,
    simpleIconSlug?: string, 
    simpleIconColor?: string
  }>
}

export default function ProprietarySoftware({ onSoftwareSelect, proprietaryTools = [] }: ProprietarySoftwareProps) {
  const handleSoftwareClick = (toolSlug: string, toolName: string) => {
    onSoftwareSelect?.(toolSlug, toolName)
  }

  return (
    <section className="bg-muted/50 overflow-hidden py-12">
      <div className="relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <p className="font-silkscreen text-3xl text-primary text-center">Popular proprietary software</p>
            <p className="text-sm text-muted-foreground text-center mt-2">Click any software to see open source alternatives</p>
          </div>
          <div className="relative py-6 w-full">
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={8}
              className="py-2"
            >
              {proprietaryTools.map((tool, index) => (
                <div
                  key={`${tool.name}-${index}`}
                  onClick={() => handleSoftwareClick(tool.slug, tool.name)}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-3 transition-opacity hover:opacity-80 cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {tool.simpleIconSlug ? (
                      <div 
                        className="w-8 h-8"
                        style={{ 
                          backgroundColor: tool.simpleIconColor || '#6B7280',
                          mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${tool.simpleIconSlug}.svg) no-repeat center`,
                          WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${tool.simpleIconSlug}.svg) no-repeat center`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain'
                        }}
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white font-silkscreen text-sm"
                        style={{ backgroundColor: tool.simpleIconColor || '#6B7280' }}
                      >
                        {tool.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-sm text-muted-foreground whitespace-nowrap">
                    {tool.name}
                  </span>
                </div>
              ))}
            </InfiniteSlider>

            <ProgressiveBlur
              direction="left"
              blurIntensity={0.9}
            />
            <ProgressiveBlur
              direction="right"
              blurIntensity={0.9}
            />
          </div>
        </div>
      </div>
    </section>
  )
}