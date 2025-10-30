'use client';

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface NoiseBackgroundProps {
  className?: string;
  color?: string; // Hex color from simpleIconColor
}

const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  className = "",
  color = "#10b981", // Default green
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a safe fallback during hydration
  const isDark = mounted ? resolvedTheme === 'dark' : false;
  // Convert hex to HSL for better color variations
  const hexToHsl = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate color variations
  const [h, s, l] = hexToHsl(color);
  
  const colors = {
    primary: color,
    secondary: hslToHex(h, Math.max(0, s - 20), Math.max(0, l - 15)),
    tertiary: hslToHex(h, Math.max(0, s - 30), Math.max(0, l - 25)),
    accent: color
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="noiseFilter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
              seed="5"
            />
            <feColorMatrix type="saturate" values="0.1" />
          </filter>
          <radialGradient
            id="themeGlow"
            cx="0%"
            cy="0%"
            r="100%"
            fx="0%"
            fy="0%"
          >
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="25%" stopColor={colors.secondary} stopOpacity="0.2" />
            <stop offset="50%" stopColor={colors.tertiary} stopOpacity="0.1" />
            <stop offset="100%" stopColor={isDark ? "#000000" : "#ffffff"} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="themeLines" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={isDark ? "#000000" : "#ffffff"} />
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
          opacity="0.4"
        />
        <rect width="100%" height="100%" fill="url(#themeGlow)" />
        <g opacity="0.2">
          <path
            d="M0,0 L100%,100%"
            stroke="url(#themeLines)"
            strokeWidth="150"
          />
          <path
            d="M100%,0 L0,100%"
            stroke="url(#themeLines)"
            strokeWidth="100"
          />
          <path
            d="M50%,0 L50%,100%"
            stroke="url(#themeLines)"
            strokeWidth="80"
          />
          <path
            d="M0,50% L100%,50%"
            stroke="url(#themeLines)"
            strokeWidth="60"
          />
        </g>
      </svg>
    </div>
  );
};

export default NoiseBackground;