"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { DuoIcon } from "@/components/DuoIcon";
import { useTheme } from "next-themes";
import { useBuildStatsCardState, useSelectedCapabilities } from "@/hooks/use-capabilities-config";
import { motion } from "framer-motion";

export function MobileNav({ onClose }: { onClose: () => void }) {
  const { updateBuildStatsCard } = useBuildStatsCardState();
  const selectedCapabilities = useSelectedCapabilities();
  const { theme, setTheme } = useTheme();
  const prevCountRef = React.useRef(selectedCapabilities.length);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (selectedCapabilities.length > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      prevCountRef.current = selectedCapabilities.length;
      return () => clearTimeout(timer);
    }

    prevCountRef.current = selectedCapabilities.length;
  }, [selectedCapabilities.length]);

  const handleOpenBuilder = () => {
    updateBuildStatsCard({ isDrawerOpen: true });
    onClose();
  };

  return (
    <nav className="border-t border-border bg-background">
      <div className="px-4 py-4">
        <div className="grid gap-2">
          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
          >
            <Link href="/ethos" onClick={onClose}>
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="ethos"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-fuchsia-500 dark:text-fuchsia-400"
                />
                Ethos
              </span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
          >
            <Link href="/categories" onClick={onClose}>
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="category"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-emerald-500 dark:text-emerald-400"
                />
                Categories
              </span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
          >
            <Link href="/compare" onClick={onClose}>
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="compare"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-blue-500 dark:text-blue-400"
                />
                Compare
              </span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
          >
            <a href="https://github.com/junaid33/opensource.builders" target="_blank" rel="noopener noreferrer" onClick={onClose}>
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="github"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-indigo-500 dark:text-indigo-400"
                />
                Source Code
              </span>
            </a>
          </Button>

          <button
            type="button"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              onClose();
            }}
            className="flex h-11 items-center gap-3 rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne font-medium transition-colors hover:bg-accent"
          >
            {theme === "dark" ? (
              <>
                <DuoIcon
                  name="sun"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-amber-500 dark:text-amber-400"
                />
                Light Mode
              </>
            ) : (
              <>
                <DuoIcon
                  name="moon"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-rose-500 dark:text-rose-400"
                />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      <motion.div
        className="px-4 pb-6"
        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Button
          size="lg"
          className="flex w-full items-center justify-start gap-3 rounded-none px-4 text-left font-syne text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
          onClick={handleOpenBuilder}
        >
          <Wand2 className="size-4" />
          Build
          {selectedCapabilities.length > 0 && (
            <div className="flex size-5 items-center justify-center border border-foreground/10 bg-background text-[10px] font-bold text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
              {selectedCapabilities.length}
            </div>
          )}
        </Button>
      </motion.div>
    </nav>
  );
}
