import React from "react";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { Slash, X } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

interface LogoIconProps {
  className?: string;
  suffix?: string;
}

export const LogoIcon = ({ className, suffix = "" }: LogoIconProps) => {
  const id = (base: string) => `${base}${suffix}`;
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <style>
        {`
          .light-mode${suffix} {
            display: block;
          }
          .dark-mode${suffix} {
            display: none;
          }

          .dark .light-mode${suffix} {
            display: none;
          }
          .dark .dark-mode${suffix} {
            display: block;
          }
        `}
      </style>

      <g className={`light-mode${suffix}`} clipPath={`url(#${id("clip0_104_35")})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200ZM100 143.75C124.162 143.75 143.75 124.162 143.75 100C143.75 75.8375 124.162 56.25 100 56.25C75.8375 56.25 56.25 75.8375 56.25 100C56.25 124.162 75.8375 143.75 100 143.75Z"
          fill={`url(#${id("paint0_linear_104_157")})`}
        />
      </g>

      <g className={`dark-mode${suffix}`} clipPath={`url(#${id("clip0_104_35")})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200ZM100 143.75C124.162 143.75 143.75 124.162 143.75 100C143.75 75.8375 124.162 56.25 100 56.25C75.8375 56.25 56.25 75.8375 56.25 100C56.25 124.162 75.8375 143.75 100 143.75Z"
          fill={`url(#${id("paint0_linear_dark_104_157")})`}
        />
      </g>

      <defs>
        <linearGradient
          id={id("paint0_linear_104_157")}
          x1="100"
          y1="0"
          x2="100"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#475569" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient
          id={id("paint0_linear_dark_104_157")}
          x1="100"
          y1="0"
          x2="100"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <clipPath id={id("clip0_104_35")}>
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn(spaceGrotesk.className, className)}>
      <div className="flex items-center gap-2 text-zinc-700 dark:text-white">
        <LogoIcon className="size-4" />
        <h1 className="mb-1 font-bold tracking-tight text-base sm:text-lg">
          opensource<span className="font-semibold opacity-60 mx-1">x</span>
          builders
        </h1>
      </div>
    </div>
  );
};
