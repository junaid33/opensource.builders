'use client'

import { cn } from '@/lib/utils'

interface DonutChartProps {
  value: number
  total: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
}

export function DonutChart({ 
  value, 
  total, 
  size = 60, 
  strokeWidth = 6, 
  className,
  showLabel = true 
}: DonutChartProps) {
  const percentage = total === 0 ? 0 : (value / total) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="text-green-500 transition-all duration-300 ease-in-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">
              {value}/{total}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}