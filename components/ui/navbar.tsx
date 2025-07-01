import { Logo } from "@/features/dashboard/components/Logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NavbarSearch } from "@/features/search/components/NavbarSearch"
import { Sparkles } from "lucide-react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("z-50 w-full", className)}>
      <div className="flex h-16 items-center">
        {/* Left side */}
        <div className="mr-4 hidden md:flex">
          {/* Logo */}
          <a className="mr-4 flex items-center space-x-2 lg:mr-6" href="/">
            <Logo />
          </a>
        
        </div>

        {/* Center search bar (desktop only) */}
        <div className="flex-1 hidden md:flex justify-center">
          <NavbarSearch />
        </div>

        {/* Mobile and Desktop Right Side */}
        <div className="flex flex-1 md:flex-none items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="md:hidden">
              <a className="flex items-center space-x-2" href="/">
                <Logo />
              </a>
            </div>
          </div>

          {/* Right side */}
          <nav className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button size="sm" asChild>
              <a href="/build" className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Build
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 