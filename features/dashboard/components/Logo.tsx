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
      <g clipPath={`url(#${id("clip0_104_35")})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M107.143 0H92.8571V63.2531L69.1621 4.60582L55.9166 9.95735L80.2255 70.1239L34.3401 24.2385L24.2386 34.3401L68.2177 78.3191L11.2241 53.4181L5.50459 66.5089L65.8105 92.8571H0V107.143H65.8104L5.50461 133.491L11.2241 146.582L68.2176 121.681L24.2386 165.66L34.3401 175.761L80.2255 129.876L55.9166 190.043L69.1621 195.394L92.8571 136.747V200H107.143V136.747L130.838 195.394L144.083 190.043L119.775 129.876L165.66 175.761L175.761 165.66L131.782 121.681L188.776 146.582L194.495 133.491L134.19 107.143H200V92.8571H134.189L194.495 66.5089L188.776 53.4181L131.782 78.3191L175.761 34.34L165.66 24.2385L119.775 70.1238L144.083 9.95735L130.838 4.60582L107.143 63.2531V0Z"
          fill={`url(#${id("paint0_linear_104_35")})`}
        />
      </g>
      <defs>
        <linearGradient
          id={id("paint0_linear_104_35")}
          x1="14"
          y1="26"
          x2="179"
          y2="179.5"
          gradientUnits="userSpaceOnUse"
        >
          {/* <stop stopColor="#E9B8FF" />
          <stop offset="1" stopColor="#F9ECFF" /> */}
          <stop stopColor="#5c6bc0" />
          <stop offset="1" stopColor="#4f39f6" />
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
        <LogoIcon className="size-5 mb-1" suffix="-full" />
          <h1 className="mb-1 font-bold tracking-tight text-xl">
          key<span className="font-semibold opacity-60 mx-1">x</span>next
        </h1>
      </div>
    </div>
  );
};
