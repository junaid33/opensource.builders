"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MarqueeItem {
  text: string
  href: string
}

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  items?: MarqueeItem[]
  repeat?: number
  duration?: number
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  strokeWidth?: string
  reverse?: boolean
  accentColor?: "blue" | "green" | "purple" | "red" | "orange"
}

const fontSizeClasses = {
  sm: "text-5xl sm:text-6xl md:text-7xl",
  md: "text-6xl sm:text-7xl md:text-8xl",
  lg: "text-7xl sm:text-8xl md:text-9xl",
  xl: "text-8xl sm:text-9xl md:text-[10rem]",
  "2xl": "text-9xl sm:text-[10rem] md:text-[11rem]",
  "3xl": "text-[10rem] sm:text-[11rem] md:text-[12rem]",
}

const accentColors = {
  blue: {
    className: 'text-blue-500/10 dark:text-blue-400/15',
    strokeClassName: '[--marquee-stroke:theme(colors.blue.500)] dark:[--marquee-stroke:theme(colors.blue.400)]'
  },
  green: {
    className: 'text-green-500/10 dark:text-green-400/15',
    strokeClassName: '[--marquee-stroke:theme(colors.green.500)] dark:[--marquee-stroke:theme(colors.green.400)]'
  },
  purple: {
    className: 'text-purple-500/10 dark:text-purple-400/15',
    strokeClassName: '[--marquee-stroke:theme(colors.purple.500)] dark:[--marquee-stroke:theme(colors.purple.400)]'
  },
  red: {
    className: 'text-red-500/10 dark:text-red-400/15',
    strokeClassName: '[--marquee-stroke:theme(colors.red.500)] dark:[--marquee-stroke:theme(colors.red.400)]'
  },
  orange: {
    className: 'text-orange-500/10 dark:text-orange-400/15',
    strokeClassName: '[--marquee-stroke:theme(colors.orange.500)] dark:[--marquee-stroke:theme(colors.orange.400)]'
  },
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({
    className,
    text,
    items,
    repeat = 4,
    duration = 20,
    fontSize = "lg",
    strokeWidth = "1px",
    reverse = false,
    accentColor,
    ...props
  }, ref) => {
    // If items are provided, create content from items; otherwise use text
    const content = items ? items.map(item => item.text).join(' • ') : text

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-screen overflow-hidden py-16",
          className
        )}
        {...props}
      >
        <>
          <div className="absolute left-0 top-0 bottom-0 w-[20%] bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-gradient-to-l from-background to-transparent z-10" />
        </>
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"]
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            duration,
          }}
        >
          {[...Array(repeat)].map((_, index) => (
            <div key={index} className="flex items-center mx-4">
              {items ? (
                // Render clickable items
                <div className="flex items-center">
                  {items.map((item, itemIndex) => (
                    <React.Fragment key={`${index}-${itemIndex}`}>
                      <Link
                        href={item.href}
                        className={cn(
                          fontSizeClasses[fontSize],
                          "font-bold px-4 hover:opacity-75 transition-opacity duration-200",
                          accentColor ? accentColors[accentColor].className : "text-transparent",
                          accentColor ? accentColors[accentColor].strokeClassName : ""
                        )}
                        style={{
                          WebkitTextStroke: `${strokeWidth} ${accentColor ? 'var(--marquee-stroke)' : 'hsl(var(--muted-foreground))'}`,
                        }}
                      >
                        {item.text}
                      </Link>
                      {itemIndex < items.length - 1 && (
                        <span
                          className={cn(
                            fontSizeClasses[fontSize],
                            "font-bold px-2",
                            accentColor ? accentColors[accentColor].className : "text-transparent",
                            accentColor ? accentColors[accentColor].strokeClassName : ""
                          )}
                          style={{
                            WebkitTextStroke: `${strokeWidth} ${accentColor ? 'var(--marquee-stroke)' : 'hsl(var(--muted-foreground))'}`,
                          }}
                        >
                          •
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                // Render plain text (backward compatibility)
                <span
                  className={cn(
                    fontSizeClasses[fontSize],
                    "font-bold px-4",
                    accentColor ? accentColors[accentColor].className : "text-transparent",
                    accentColor ? accentColors[accentColor].strokeClassName : ""
                  )}
                  style={{
                    WebkitTextStroke: `${strokeWidth} ${accentColor ? 'var(--marquee-stroke)' : 'hsl(var(--muted-foreground))'}`,
                  }}
                >
                  {text}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    )
  }
)

Marquee.displayName = "Marquee"