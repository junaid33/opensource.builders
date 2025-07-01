import { Sparkles } from "lucide-react"
import { Logo } from "@/features/dashboard/components/Logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavbarSearch } from "@/features/search/components/NavbarSearch"
import { cn } from "@/lib/utils"

// Removed navigation links - no longer needed

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {

  return (
    <header className={cn("border-b px-4 md:px-6", className)}>
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
          </div>
        </div>
        
        {/* Middle area - Search */}
        <div className="grow">
          <div className="flex justify-center">
            <NavbarSearch />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          {/* Build button - responsive: icon on mobile, text on desktop */}
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <a href="/build">
              <Sparkles className="h-4 w-4" />
              Build
            </a>
          </Button>
          <Button size="icon" asChild className="size-8"> 
            <a href="/build" className="sm:hidden inline-flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}