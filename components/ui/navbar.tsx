import { Logo } from "@/features/dashboard/components/Logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { NavbarSearch } from "@/features/search/components/NavbarSearch"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home", active: true },
  { href: "#features", label: "Features" },
  { href: "#alternatives", label: "Alternatives" },
  { href: "/build", label: "Build" },
  { href: "/tools", label: "Tools" },
]

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

        {/* Mobile menu */}
        <div className="flex flex-1 md:flex-none items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="md:hidden">
              <a className="flex items-center space-x-2" href="/">
                <Logo />
              </a>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="group size-8 md:hidden"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12h20"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12h20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12h20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <nav className="flex flex-col space-y-2">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={cn(
                      "block px-2 py-1.5 text-sm transition-colors hover:text-primary",
                      link.active ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </PopoverContent>
          </Popover>

          {/* Right side */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/signin">Sign In</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/build">Build</a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 