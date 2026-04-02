"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/navigation";
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
            onClick={onClose}
          >
            <a href="/ethos">
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="ethos"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-fuchsia-500 dark:text-fuchsia-400"
                />
                Ethos
              </span>
            </a>
          </Button>
          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
            onClick={onClose}
          >
            <a href="/categories">
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="category"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-emerald-500 dark:text-emerald-400"
                />
                Categories
              </span>
            </a>
          </Button>

          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
            onClick={onClose}
          >
            <a href="/compare">
              <span className="flex items-center gap-3">
                <DuoIcon
                  name="compare"
                  primaryColor="currentColor"
                  secondaryColor="currentColor"
                  className="text-blue-500 dark:text-blue-400"
                />
                Compare
              </span>
            </a>
          </Button>

          <Button
            asChild
            className="h-11 justify-start rounded-none border border-border bg-secondary/50 px-4 text-left text-base font-syne"
            variant="ghost"
            onClick={onClose}
          >
            <a href="https://github.com/junaid33/opensource.builders" target="_blank" rel="noopener noreferrer">
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
          className="w-full justify-start font-syne font-bold uppercase tracking-wider text-xs rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex items-center gap-3 px-4 text-left"
          onClick={handleOpenBuilder}
        >
          <Wand2 className="size-4" />
          Build
          {selectedCapabilities.length > 0 && (
            <div className="flex items-center justify-center bg-background text-foreground size-5 text-[10px] font-bold border border-foreground/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
              {selectedCapabilities.length}
            </div>
          )}
        </Button>
      </motion.div>
    </nav>
  );
}
