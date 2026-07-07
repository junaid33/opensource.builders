"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, Wand2 } from "lucide-react";
import { GeistPixelSquare } from "geist/font/pixel";
import { DuoIcon } from "@/components/DuoIcon";
import { ThemeSwitcher } from "@/components/ui/theme-toggle";
import { useBuildStatsCardState, useSelectedCapabilities } from "@/hooks/use-capabilities-config";
import { motion } from "framer-motion";

type MobileNavItem = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  external?: boolean;
};

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

  const navItems: MobileNavItem[] = [
    {
      href: "/categories",
      title: "Categories",
      description: "Browse the software map",
      icon: <DuoIcon name="category" primaryColor="currentColor" secondaryColor="currentColor" className="text-emerald-500 dark:text-emerald-400" />,
    },
    {
      href: "/compare",
      title: "Compare",
      description: "Put two apps side by side",
      icon: <DuoIcon name="compare" primaryColor="currentColor" secondaryColor="currentColor" className="text-blue-500 dark:text-blue-400" />,
    },
    {
      href: "/ethos",
      title: "Ethos",
      description: "Why source-owned software matters",
      icon: <DuoIcon name="ethos" primaryColor="currentColor" secondaryColor="currentColor" className="text-fuchsia-500 dark:text-fuchsia-400" />,
    },
    {
      href: "https://github.com/junaid33/opensource.builders",
      title: "Source Code",
      description: "Open the public repository",
      external: true,
      icon: <DuoIcon name="github" primaryColor="currentColor" secondaryColor="currentColor" className="text-indigo-500 dark:text-indigo-400" />,
    },
  ];

  return (
    <nav className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-2 border border-border bg-secondary/30 px-2.5 py-2">
          <div className="min-w-0">
            <p className={cn(GeistPixelSquare.className, "text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground")}>Menu</p>
            <p className="mt-0.5 truncate text-xs text-foreground">Navigate the open source catalog.</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeSwitcher
              rounded={false}
              className="h-7 border-border bg-background px-0.5 shadow-none [&_button]:!size-5 [&_svg]:!size-3"
            />
            <a
              href="https://github.com/junaid33/opensource.builders"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              aria-label="View opensource.builders on GitHub"
              className={cn(
                GeistPixelSquare.className,
                "inline-flex h-7 items-center justify-center gap-1.5 border border-border bg-background px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <Star className="size-2.5 fill-orange-400 text-orange-400" aria-hidden="true" />
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <span className="text-foreground/70">1.1K</span>
            </a>
          </div>
        </div>

        <div className="grid gap-1.5">
          {navItems.map((item) => (
            <MobileNavLink key={item.title} item={item} onClose={onClose} />
          ))}
        </div>

        <motion.div className="mt-3" animate={isAnimating ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 0.3 }}>
          <Button
            className={cn(
              GeistPixelSquare.className,
              "flex h-10 w-full items-center justify-center gap-1.5 rounded-none px-3 text-[10px] font-semibold uppercase tracking-[0.12em] shadow-none"
            )}
            onClick={handleOpenBuilder}
          >
            <Wand2 className="size-3.5" aria-hidden="true" />
            Build
            {selectedCapabilities.length > 0 && (
              <span className="flex size-4 items-center justify-center border border-primary-foreground/25 bg-primary-foreground text-[9px] font-bold text-primary">
                {selectedCapabilities.length}
              </span>
            )}
          </Button>
        </motion.div>
      </div>
    </nav>
  );
}

function MobileNavLink({ item, onClose }: { item: MobileNavItem; onClose: () => void }) {
  const className = "group flex items-center gap-2 border border-border bg-background p-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-card [&_svg]:size-3.5">
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-4 text-foreground">{item.title}</span>
        <span className="block truncate text-[11px] leading-4 text-muted-foreground">{item.description}</span>
      </span>
      <span aria-hidden="true" className="text-xs text-muted-foreground/50 transition-transform group-hover:translate-x-0.5">→</span>
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClose} className={className}>
      {content}
    </Link>
  );
}
