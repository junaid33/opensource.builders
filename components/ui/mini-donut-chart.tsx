import React from 'react';
import { cn } from '@/lib/utils';

interface MiniDonutChartProps {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

export function MiniDonutChart({
  value,
  total,
  size = 16,
  strokeWidth = 2,
  className,
  color
}: MiniDonutChartProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/20"
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
          className={cn(
            "transition-all duration-300 ease-in-out",
            color ? color : (
              percentage >= 80 ? "text-emerald-500" :
              percentage >= 60 ? "text-yellow-500" :
              "text-red-500"
            )
          )}
        />
      </svg>
    </div>
  );
} 