"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/navigation";
import { Wand2 } from "lucide-react";
import { useBuildStatsCardState, useSelectedCapabilities } from "@/hooks/use-capabilities-config";
import { motion } from "framer-motion";

export function MobileNav({ onClose }: { onClose: () => void }) {
  const { updateBuildStatsCard } = useBuildStatsCardState();
  const selectedCapabilities = useSelectedCapabilities();
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
    <nav className="border-t border-border">
      <div className="px-4 py-6 space-y-1">
        {navLinks.map((link) => (
          <Button
            asChild
            className="justify-start text-lg font-syne w-full"
            key={link.label}
            variant="ghost"
            onClick={onClose}
          >
            <a href={link.href}>{link.label}</a>
          </Button>
        ))}
      </div>

      <motion.div
        className="px-4 pb-6"
        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Button
          size="lg"
          className="w-full font-syne font-bold uppercase tracking-wider text-xs rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
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
