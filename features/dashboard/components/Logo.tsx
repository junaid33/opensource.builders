import React from "react";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { Slash, X } from "lucide-react";
import { LogoIcon as LI } from "./LogoIcon";

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
    <div className="flex items-center size-5 mb-0.5">
      <LI className="text-blue-500"/>
    </div>
  );
};

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn(spaceGrotesk.className, className)}>
      <div className="flex items-center gap-2 text-zinc-700 dark:text-white">
        <LogoIcon suffix="-full" />
        <h1 className="mb-1 font-bold tracking-tighter text-lg">
          opensource<span className="font-semibold opacity-60 mx-1">x</span>builders
        </h1>
      </div>
    </div>
  );
};
