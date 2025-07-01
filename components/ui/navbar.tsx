import { useId } from "react"
import { HouseIcon, SearchIcon, ZapIcon, MicIcon, Sparkles } from "lucide-react"
import { Logo } from "@/features/dashboard/components/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

// Removed navigation links - no longer needed

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
  const id = useId()

  return (
    <header className={cn("border-b px-4 md:px-6", className)}>
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
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
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-2 md:hidden">
              <Button size="sm" asChild className="w-full">
                <a href="/build" className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Build
                </a>
              </Button>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
          </div>
        </div>
        
        {/* Middle area - Search */}
        <div className="grow max-sm:hidden">
          <div className="relative mx-auto w-full max-w-xs">
            <Input
              id={id}
              className="peer h-8 px-8"
              placeholder="Search..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Press to speak"
              type="submit"
            >
              <MicIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button size="sm" asChild className="max-md:hidden">
            <a href="/build" className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Build
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}