"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useBuildStatsCardState, useSelectedCapabilities } from "@/hooks/use-capabilities-config";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, MoreVertical, Package, Search as SearchIcon } from "lucide-react";
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
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const { data: searchResults, isLoading: isSearching } = useDebouncedSearch(searchTerm, 300);

  const hasSearchResults = Boolean(
    searchResults &&
      (searchResults.openSourceApplications.length > 0 ||
        searchResults.proprietaryApplications.length > 0 ||
        searchResults.capabilities.length > 0)
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

  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideDesktopSearch = desktopSearchRef.current?.contains(target) ?? false;
      const isInsideMobileActions = mobileActionsRef.current?.contains(target) ?? false;
      const isInsideMobileSearchPanel = mobileSearchPanelRef.current?.contains(target) ?? false;
      const isInsideMobileMenuPanel = mobileMenuPanelRef.current?.contains(target) ?? false;
      const isInsideMoreMenu = moreRef.current?.contains(target) ?? false;

      if (!isInsideMoreMenu) {
        setMoreOpen(false);
      }

      if (!isInsideDesktopSearch && !isInsideMobileActions && !isInsideMobileSearchPanel) {
        setSearchOpen(false);
      }

      if (!isInsideMobileActions && !isInsideMobileMenuPanel) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    return () => document.removeEventListener("mousedown", handlePointerDownOutside);
  }, []);

  const closeSearch = (clearTerm = false) => {
    setSearchOpen(false);
    if (clearTerm) {
      setSearchTerm("");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      closeSearch(true);
      return;
    }

    closeMenu();
    setSearchOpen(true);
  };

  const handleMenuToggle = () => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    closeSearch(false);
    setMenuOpen(true);
  };

  const handleSearchResultClick = () => {
    setSearchTerm("");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header
      data-state={menuOpen ? "active" : "inactive"}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        (menuOpen || searchOpen || moreOpen || scrolled) &&
          "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <div className="mx-8 hidden max-w-md flex-1 md:flex" ref={desktopSearchRef}>
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alternatives, apps, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="h-9 w-full border border-border bg-secondary pl-9 pr-3 text-sm outline-none transition-colors focus:ring-1 focus:ring-muted"
            />

            {searchOpen && searchTerm.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-border bg-background shadow-lg">
                <div className="py-1">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults ? (
                    <div className="max-h-80 overflow-auto">
                      {searchResults.openSourceApplications.length > 0 && (
                        <div>
                          <div className="mb-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                            Open Source
                          </div>
                          {searchResults.openSourceApplications.slice(0, 5).map((app) => (
                            <Link
                              key={app.id}
                              href={`/os-alternatives/${app.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {searchResults.proprietaryApplications.length > 0 && (
                        <div>
                          <div className="mb-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                            Proprietary
                          </div>
                          {searchResults.proprietaryApplications.slice(0, 5).map((app) => (
                            <Link
                              key={app.id}
                              href={`/alternatives/${app.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {searchResults.capabilities.length > 0 && (
                        <div>
                          <div className="mb-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                            Capabilities
                          </div>
                          {searchResults.capabilities.slice(0, 5).map((capability) => (
                            <Link
                              key={capability.id}
                              href={`/capabilities/${capability.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{capability.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {!hasSearchResults && (
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

        <div className="hidden items-center gap-2 md:flex">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                syne.className,
                "h-8 rounded-none border border-border bg-secondary/50 px-4 text-[10px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-secondary/80 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
              )}
            >
              <Link href="/ethos">Ethos</Link>
            </Button>
          </motion.div>

          <motion.div
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                syne.className,
                "relative flex h-8 items-center gap-2 rounded-none border border-border bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-primary/90 hover:text-primary-foreground active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
              )}
              onClick={() => updateBuildStatsCard({ isDrawerOpen: true })}
            >
              Build
              {selectedCapabilities.length > 0 && (
                <div className="flex size-4 items-center justify-center bg-background text-[9px] font-bold text-foreground">
                  {selectedCapabilities.length}
                </div>
              )}
            </Button>
          </motion.div>

          <div className="relative" ref={moreRef}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                syne.className,
                "h-8 rounded-none border border-border bg-secondary/50 px-3 text-[10px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-secondary/80 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
              )}
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-label="Open more navigation"
            >
              <MoreVertical className="size-4" />
            </Button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-52 border border-border bg-background shadow-lg">
                <div className="py-1">
                  <Link
                    href="/categories"
                    className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setMoreOpen(false)}
                  >
                    <DuoIcon
                      name="category"
                      primaryColor="currentColor"
                      secondaryColor="currentColor"
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    Categories
                  </Link>
                  <Link
                    href="/compare"
                    className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setMoreOpen(false)}
                  >
                    <DuoIcon
                      name="compare"
                      primaryColor="currentColor"
                      secondaryColor="currentColor"
                      className="text-blue-500 dark:text-blue-400"
                    />
                    Compare
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <a
                    href="https://github.com/junaid33/opensource.builders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
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

        <div className="flex items-center gap-1 md:hidden" ref={mobileActionsRef}>
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={handleSearchToggle}
            className="inline-flex h-10 w-10 items-center justify-center border border-border bg-secondary/60 transition-colors hover:bg-secondary"
          >
            {searchOpen ? <X className="size-4" /> : <SearchIcon className="size-4" />}
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center border border-border bg-secondary/60 transition-colors hover:bg-secondary"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden" ref={mobileSearchPanelRef}>
          <div className="mx-auto max-w-5xl">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}

              {searchTerm.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 border border-border bg-background shadow-lg">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : hasSearchResults ? (
                    <div className="max-h-80 overflow-auto py-1">
                      {searchResults?.openSourceApplications.length ? (
                        <div>
                          <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Open Source</div>
                          {searchResults.openSourceApplications.slice(0, 5).map((app) => (
                            <Link
                              key={app.id}
                              href={`/os-alternatives/${app.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {searchResults?.proprietaryApplications.length ? (
                        <div>
                          <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Proprietary</div>
                          {searchResults.proprietaryApplications.slice(0, 5).map((app) => (
                            <Link
                              key={app.id}
                              href={`/alternatives/${app.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <ToolIcon
                                name={app.name}
                                simpleIconSlug={app.simpleIconSlug}
                                simpleIconColor={app.simpleIconColor}
                                size={16}
                                rounded="none"
                              />
                              <span className="font-medium">{app.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {searchResults?.capabilities.length ? (
                        <div>
                          <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Capabilities</div>
                          {searchResults.capabilities.slice(0, 5).map((capability) => (
                            <Link
                              key={capability.id}
                              href={`/capabilities/${capability.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{capability.name}</span>
                            </Link>
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
        <div className="md:hidden" ref={mobileMenuPanelRef}>
          <MobileNav onClose={closeMenu} />
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
      type="button"
      onClick={toggleTheme}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
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
