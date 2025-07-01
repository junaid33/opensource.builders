"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-9" />
  }

  const handleClick = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  const getCurrentIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon size={16} />
      case "dark":
        return <MoonIcon size={16} />
      case "system":
      default:
        return <Monitor size={16} />
    }
  }

  const getAriaLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode"
      case "dark":
        return "Switch to system mode"
      case "system":
      default:
        return "Switch to light mode"
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8"
      onClick={handleClick}
      aria-label={getAriaLabel()}
    >
      {getCurrentIcon()}
    </Button>
  )
}