"use client";

import { Sparkles, Info, Wand2, Leaf, Globe, Star } from "lucide-react";
import { Logo } from "@/features/dashboard/components/Logo";
import { Button } from "@/components/ui/button";
import { NavbarSearch } from "@/features/public-site/components/search/NavbarSearch";
import { DataTableDrawer } from "@/components/ui/DataTableDrawer";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
  apps: any[];
}

export default function Navbar({ className, apps }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pinnedCapabilities');
      if (saved) {
        setSelectedCapabilities(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading capabilities:', error);
    }
  }, []);

  const handleSelectedCapabilitiesChange = (capabilities) => {
    setSelectedCapabilities(capabilities);
    try {
      localStorage.setItem('pinnedCapabilities', JSON.stringify(capabilities));
    } catch (error) {
      console.error('Error saving capabilities:', error);
    }
  };

  return (
    <>
      <header className={cn("bg-transparent backdrop-blur-0 shadow-none", className)}>
        <div className="flex flex-col">
          {/* Main navbar row */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <a href="/" className="text-primary hover:text-primary/90">
                <Logo />
              </a>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-4 max-w-md">
              <NavbarSearch />
            </div>

            {/* Right side - GitHub, About and Build button */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* GitHub Stars */}
              <a
                href="https://github.com/junaid33/opensource.builders"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Star className="size-3.5" />
                <span className="hidden sm:inline">1.3k</span>
              </a>

              {/* About - outline button on desktop, icon only on mobile */}
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href="/ethos">
                  <Globe className="size-3.5" />
                  <span className="hidden sm:inline ml-1">Ethos</span>
                </a>
              </Button>

              {/* Build - text on desktop, icon only on mobile */}
              <Button
                size="sm"
                className="hidden sm:flex gap-3"
                onClick={() => setDrawerOpen(true)}
              >
                <Wand2 className="size-3" />
                Build
              </Button>

              {/* Build - icon only on mobile */}
              <Button
                size="icon"
                className="sm:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <Wand2 className="size-3" />
              </Button>
            </div>
          </div>

          {/* Mobile search row (shown only on mobile) */}
          <div className="flex md:hidden items-center pb-3">
            <NavbarSearch />
          </div>
        </div>
      </header>
      
      <DataTableDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        apps={apps}
        selectedCapabilities={selectedCapabilities}
        onSelectedCapabilitiesChange={handleSelectedCapabilitiesChange}
      />
    </>
  );
}
