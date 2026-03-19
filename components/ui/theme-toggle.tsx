/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { type ComponentProps, useDeferredValue, useEffect, useState } from "react";

const THEMES = [
  {
    type: "system",
    icon: Monitor,
    label: "system theme",
  },
  {
    type: "light",
    icon: Sun,
    label: "light theme",
  },
  {
    type: "dark",
    icon: Moon,
    label: "dark theme",
  },
] as const;

type Theme = (typeof THEMES)[number]["type"];

interface ThemeSwitcherProps
  extends Omit<ComponentProps<"div">, "onChange" | "value" | "defaultValue"> {
  value?: Theme;
  onChange?: (theme: Theme) => void;
  defaultValue?: Theme;
}

function ThemeSwitcher({
  value,
  onChange,
  defaultValue,
  className,
  rounded = true,
  ...props
}: ThemeSwitcherProps & { rounded?: boolean }) {
  const { theme, setTheme } = useTheme();
  const deferredTheme = useDeferredValue(theme, "system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "relative isolate inline-flex h-8 items-center border shadow-xs px-1",
          rounded ? "rounded-full" : ""
        )}
        data-theme-switcher
        {...props}
      >
        {THEMES.map(({ type, icon: Icon }) => (
          <div
            className={cn(
              "group relative size-5.5",
              rounded ? "rounded-full" : ""
            )}
            key={type}
          >
            <Icon
              className={cn(
                "relative m-auto size-3.5",
                "transition duration-200 ease-out",
                "text-secondary-foreground"
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 items-center border shadow-xs px-1",
        rounded ? "rounded-full" : "",
        className
      )}
      data-theme-switcher
      {...props}
    >
      {THEMES.map(({ type, icon: Icon, label }) => {
        const isActive = deferredTheme === type;

        return (
          <button
            aria-label={`Switch to ${label}`}
            className={cn(
              "group relative size-5.5 transition duration-200 ease-out",
              rounded ? "rounded-full" : ""
            )}
            key={type}
            onClick={() => setTheme(type)}
            title={`Switch to ${label}`}
            type="button"
            data-umami-event={`Switch Theme to ${type}`}
          >
            {isActive && (
              <div className="-z-1 absolute inset-0 bg-blue-100 dark:bg-blue-500" />
            )}
            <Icon
              className={cn(
                "relative m-auto size-3.5",
                "transition duration-200 ease-out",
                isActive
                  ? "text-foreground"
                  : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export { ThemeSwitcher };

// Keep the old ThemeToggle export for backward compatibility
export const ThemeToggle = ThemeSwitcher;