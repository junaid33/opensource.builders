import { LogoIcon } from "./LogoIcon";
import { cn } from "@/lib/utils";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  textOnly?: boolean;
}

export function Logo({ className, iconOnly = false, textOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!textOnly && <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />}
      {!iconOnly && (
        <span className={cn(syne.className, "font-semibold tracking-tighter text-lg select-none")}>
          <span className="text-foreground">opensource</span>
          <span className="text-muted-foreground">.builders</span>
        </span>
      )}
    </div>
  );
}
