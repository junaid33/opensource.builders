import { Sparkles } from "lucide-react";
import { Logo } from "@/features/dashboard/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavbarSearch } from "@/features/search/components/NavbarSearch";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("px-4 md:px-6", className)}>
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

          {/* Right side - Theme toggle and Build button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="text-sm">
              <a href="/build" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Build
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile search row (shown only on mobile) */}
        <div className="flex md:hidden">
          <NavbarSearch />
        </div>
      </div>
    </header>
  );
}
