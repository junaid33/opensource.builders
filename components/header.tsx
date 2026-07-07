"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { MobileNav } from "./mobile-nav";
import { useBuildStatsCardState } from "@/hooks/use-capabilities-config";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, X, Package, Search as SearchIcon, Star } from "lucide-react";
import { GeistPixelSquare } from "geist/font/pixel";
import { useDebouncedSearch } from "@/features/public-site/lib/hooks/use-search";
import ToolIcon from "@/components/ToolIcon";
import { DuoIcon } from "@/components/DuoIcon";
import { ThemeSwitcher } from "@/components/ui/theme-toggle";

export function Header() {
  const scrolled = useScroll(10);
  const { updateBuildStatsCard } = useBuildStatsCardState();
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
              className="h-9 w-full border border-border bg-secondary pl-9 pr-3 text-base outline-none transition-colors focus:ring-1 focus:ring-muted"
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

        <div className="hidden items-center gap-3 md:flex">
          <StarsBadge />

          <span aria-hidden="true" className="flex h-7 items-center text-[14px] font-medium leading-none text-foreground/70">
            /
          </span>

          <Link
            href="/ethos"
            className={cn(
              GeistPixelSquare.className,
              "flex h-7 items-center text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
            )}
          >
            Ethos
          </Link>

          <span aria-hidden="true" className="flex h-7 items-center text-[14px] font-medium leading-none text-foreground/70">
            /
          </span>

          <button
            type="button"
            className={cn(
              GeistPixelSquare.className,
              "flex h-7 items-center text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
            )}
            onClick={() => updateBuildStatsCard({ isDrawerOpen: true })}
          >
            Build
          </button>

          <span aria-hidden="true" className="flex h-7 items-center text-[14px] font-medium leading-none text-foreground/70">
            /
          </span>

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className={cn(
                GeistPixelSquare.className,
                "flex h-7 items-center gap-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
              )}
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-label="Open more navigation"
            >
              More
              <ChevronDown className="size-3 stroke-[3] text-foreground/80" aria-hidden="true" />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[25rem] max-w-[calc(100vw-2rem)] overflow-hidden border border-border bg-background shadow-2xl shadow-black/10 dark:shadow-black/40">
                <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/35 px-4 py-3">
                  <div className="min-w-0">
                    <p className={cn(GeistPixelSquare.className, "text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground")}>Menu</p>
                    <p className="mt-1 truncate text-sm text-foreground">Navigate the open source catalog.</p>
                  </div>
                  <ThemeSwitcher rounded={false} className="h-8 border-border bg-background px-1 shadow-none [&_button]:size-5 [&_svg]:size-3" />
                </div>

                <div className="p-2">
                  <MoreFeaturedLink
                    href="/categories"
                    title="Categories"
                    description="Browse the software map"
                    icon={<DuoIcon name="category" primaryColor="currentColor" secondaryColor="currentColor" className="text-emerald-500 dark:text-emerald-400" />}
                    onClick={() => setMoreOpen(false)}
                  />
                  <MoreFeaturedLink
                    href="/compare"
                    title="Compare"
                    description="Put two apps side by side"
                    icon={<DuoIcon name="compare" primaryColor="currentColor" secondaryColor="currentColor" className="text-blue-500 dark:text-blue-400" />}
                    onClick={() => setMoreOpen(false)}
                  />
                  <MoreFeaturedLink
                    href="/ethos"
                    title="Ethos"
                    description="Why source-owned software matters"
                    icon={<DuoIcon name="ethos" primaryColor="currentColor" secondaryColor="currentColor" className="text-fuchsia-500 dark:text-fuchsia-400" />}
                    onClick={() => setMoreOpen(false)}
                  />
                  <MoreFeaturedLink
                    href="https://github.com/junaid33/opensource.builders"
                    title="Source Code"
                    description="Open the public repository"
                    external
                    icon={<DuoIcon name="github" primaryColor="currentColor" secondaryColor="currentColor" className="text-indigo-500 dark:text-indigo-400" />}
                    onClick={() => setMoreOpen(false)}
                  />
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden" ref={mobileActionsRef}>
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={handleSearchToggle}
            className={cn(
              GeistPixelSquare.className,
              "flex h-7 items-center text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
            )}
          >
            {searchOpen ? "Close" : "Search"}
          </button>

          <span aria-hidden="true" className="flex h-7 items-center text-[14px] font-medium leading-none text-foreground/70">
            /
          </span>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
            className={cn(
              GeistPixelSquare.className,
              "flex h-7 items-center text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
            )}
          >
            {menuOpen ? "Close" : "Menu"}
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
                className="h-11 w-full border border-border bg-secondary pl-9 pr-10 text-base outline-none transition-colors focus:ring-1 focus:ring-muted"
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

function StarsBadge({ className }: { className?: string }) {
  return (
    <a
      href="https://github.com/junaid33/opensource.builders"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View opensource.builders on GitHub"
      className={cn(
        GeistPixelSquare.className,
        "inline-flex h-8 items-center justify-center gap-2 text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      <Star className="size-3 fill-orange-400 text-orange-400" aria-hidden="true" />
      <span className="h-3.5 w-px bg-border" aria-hidden="true" />
      <span className="text-foreground/70">1.1K</span>
    </a>
  );
}

function MoreFeaturedLink({
  href,
  title,
  description,
  icon,
  external = false,
  onClick,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  external?: boolean;
  onClick: () => void;
}) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center border border-border bg-card [&_svg]:size-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5 text-foreground">{title}</span>
        <span className="block truncate text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
      <span aria-hidden="true" className="text-muted-foreground/50 transition-transform group-hover:translate-x-0.5">→</span>
    </>
  );
  const className = "group flex items-center gap-3 p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}


