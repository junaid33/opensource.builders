"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useBuildStatsCardState, useSelectedCapabilities } from "@/hooks/use-capabilities-config";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, MoreVertical, Search as SearchIcon } from "lucide-react";
import { Syne } from "next/font/google";
import { useDebouncedSearch } from "@/features/public-site/lib/hooks/use-search";
import ToolIcon from "@/components/ToolIcon";
import { DuoIcon } from "@/components/DuoIcon";
import { useTheme } from "next-themes";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export function Header() {
  const scrolled = useScroll(10);
  const { updateBuildStatsCard } = useBuildStatsCardState();
  const selectedCapabilities = useSelectedCapabilities();
  const [prevCount, setPrevCount] = useState(selectedCapabilities.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const moreRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const { data: searchResults, isLoading: isSearching } = useDebouncedSearch(searchTerm, 300);
  const hasSearchResults = Boolean(
    searchResults &&
      (searchResults.openSourceApplications.length > 0 ||
        searchResults.proprietaryApplications.length > 0)
  );

  useEffect(() => {
    if (selectedCapabilities.length > prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      setPrevCount(selectedCapabilities.length);
      return () => clearTimeout(timer);
    }
    setPrevCount(selectedCapabilities.length);
  }, [selectedCapabilities.length, prevCount]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => mobileSearchInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      data-state={menuOpen ? "active" : "inactive"}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        menuOpen && "md:h-screen md:bg-background/95 md:backdrop-blur md:overflow-y-auto",
        scrolled && "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4">
        {/* Logo */}
        <a href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </a>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alternatives, apps, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="w-full h-9 pl-9 pr-3 text-sm bg-secondary border border-border outline-none focus:ring-1 focus:ring-muted transition-colors"
            />

            {searchOpen && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background shadow-lg z-50 rounded-none">
                <div className="py-1">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults ? (
                    <div className="max-h-80 overflow-auto">
                      {/* Open Source Applications */}
                      {searchResults.openSourceApplications.length > 0 && (
                        <div>
                          <div className="mb-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                            Open Source
                          </div>
                          {searchResults.openSourceApplications.slice(0, 5).map((app) => (
                            <a
                              key={app.id}
                              href={`/os-alternatives/${app.slug}`}
                              onMouseDown={() => { setSearchTerm(''); setSearchOpen(false); }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Proprietary Applications */}
                      {searchResults.proprietaryApplications.length > 0 && (
                        <div>
                          <div className="mb-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                            Proprietary
                          </div>
                          {searchResults.proprietaryApplications.slice(0, 5).map((app) => (
                            <a
                              key={app.id}
                              href={`/alternatives/${app.slug}`}
                              onMouseDown={() => { setSearchTerm(''); setSearchOpen(false); }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {searchResults.openSourceApplications.length === 0 && searchResults.proprietaryApplications.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No results found
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Ethos, Build, More */}
        <div className="hidden md:flex items-center gap-2">
          {/* Ethos Button */}
          <motion.div
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <a href="/ethos">
              <Button
                variant="ghost"
                size="sm"
                className={cn(syne.className, "font-bold uppercase tracking-wider text-[10px] px-4 rounded-none h-8 border border-border bg-secondary/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:bg-secondary/80")}
              >
                Ethos
              </Button>
            </a>
          </motion.div>

          {/* Build Button */}
          <motion.div
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(syne.className, "relative font-bold uppercase tracking-wider text-[10px] px-4 rounded-none h-8 border border-border bg-primary text-primary-foreground hover:text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:bg-primary/90 flex items-center gap-2")}
              onClick={() => updateBuildStatsCard({ isDrawerOpen: true })}
            >
              Build
              {selectedCapabilities.length > 0 && (
                <div className="flex items-center justify-center bg-background text-foreground size-4 text-[9px] font-bold">
                  {selectedCapabilities.length}
                </div>
              )}
            </Button>
          </motion.div>

          {/* More Button */}
          <div className="relative" ref={moreRef}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(syne.className, "font-bold uppercase tracking-wider text-[10px] px-3 rounded-none h-8 border border-border bg-secondary/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:bg-secondary/80")}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <MoreVertical className="size-4" />
            </Button>

            {moreOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 border border-border bg-background shadow-lg z-50">
                <div className="py-1">
                  <a
                    href="/categories"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setMoreOpen(false)}
                  >
                    <DuoIcon
                      name="category"
                      primaryColor="currentColor"
                      secondaryColor="currentColor"
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    Categories
                  </a>
                  <a
                    href="/compare"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setMoreOpen(false)}
                  >
                    <DuoIcon
                      name="compare"
                      primaryColor="currentColor"
                      secondaryColor="currentColor"
                      className="text-blue-500 dark:text-blue-400"
                    />
                    Compare
                  </a>
                  <div className="my-1 border-t border-border" />
                  <a
                    href="https://github.com/junaid33/opensource.builders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setMoreOpen(false)}
                  >
                    <DuoIcon
                      name="github"
                      primaryColor="currentColor"
                      secondaryColor="currentColor"
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                    Source Code
                  </a>
                  <div className="my-1 border-t border-border" />
                  <ThemeToggleMenuItem onClose={() => setMoreOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden" ref={searchRef}>
          <button
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => {
              if (searchOpen) {
                setSearchOpen(false);
                setSearchTerm("");
              } else {
                setMenuOpen(false);
                setSearchOpen(true);
              }
            }}
            className="relative z-20 inline-flex h-10 w-10 items-center justify-center border border-border bg-secondary/60 transition-colors hover:bg-secondary"
          >
            <SearchIcon className={cn("size-4 transition-all duration-200", searchOpen && "scale-0 opacity-0")} />
            <X
              className={cn(
                "absolute size-4 scale-0 opacity-0 transition-all duration-200",
                searchOpen && "scale-100 opacity-100"
              )}
            />
          </button>

          <button
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => {
              setMenuOpen((v) => !v);
              setSearchOpen(false);
            }}
            className="relative z-20 inline-flex h-10 w-10 items-center justify-center border border-border bg-secondary/60 transition-colors hover:bg-secondary"
          >
            <Menu
              className={cn(
                "size-5 transition-all duration-200",
                menuOpen && "rotate-180 scale-0 opacity-0",
              )}
            />
            <X
              className={cn(
                "absolute size-5 -rotate-180 scale-0 opacity-0 transition-all duration-200",
                menuOpen && "rotate-0 scale-100 opacity-100",
              )}
            />
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden" ref={searchRef}>
          <div className="mx-auto max-w-5xl">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search alternatives, apps, features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full border border-border bg-secondary pl-9 pr-10 text-sm outline-none transition-colors focus:ring-1 focus:ring-muted"
              />
              {searchTerm && (
                <button
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}

              {searchTerm && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 border border-border bg-background shadow-lg">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : hasSearchResults ? (
                    <div className="max-h-80 overflow-auto py-1">
                      {searchResults?.openSourceApplications.length ? (
                        <div>
                          <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Open Source</div>
                          {searchResults.openSourceApplications.slice(0, 5).map((app) => (
                            <a
                              key={app.id}
                              href={`/os-alternatives/${app.slug}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm("");
                              }}
                              className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </a>
                          ))}
                        </div>
                      ) : null}

                      {searchResults?.proprietaryApplications.length ? (
                        <div>
                          <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Proprietary</div>
                          {searchResults.proprietaryApplications.slice(0, 5).map((app) => (
                            <a
                              key={app.id}
                              href={`/alternatives/${app.slug}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm("");
                              }}
                              className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden">
          <MobileNav onClose={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

function ThemeToggleMenuItem({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    onClose();
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-left"
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
  );
}
