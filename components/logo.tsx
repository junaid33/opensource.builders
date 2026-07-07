import { GeistPixelSquare } from "geist/font/pixel";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  textOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {!iconOnly && (
        <>
          <style>{`
            @keyframes logo-open-source-in {
              0% { transform: translateX(1.6rem) translateY(-0.25rem); }
              100% { transform: translateX(0) translateY(-0.25rem); }
            }
            @keyframes logo-builders-in {
              0% { transform: translateX(-1.6rem) translateY(0.5rem); }
              100% { transform: translateX(0) translateY(0.5rem); }
            }
          `}</style>
          <span
            className={cn(
              GeistPixelSquare.className,
              "relative isolate inline-flex items-center text-lg leading-none select-none [-webkit-text-stroke:0.6px_currentColor]",
            )}
            aria-label="Open Source Builders"
          >
            {/* Clip wrapper: overflow hidden masks the word until it clears the slash */}
            {/* OPENSOURCE clip wrapper */}
            <span className="overflow-hidden inline-block relative z-0 -mr-3 py-2 -my-2">
              <span
                className="block text-[0.85em] text-foreground motion-reduce:transform-none"
                style={{
                  transform: "translateX(1.6rem) translateY(-0.25rem)",
                  animation:
                    "logo-open-source-in 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
                }}
              >
                OPENSOURCE
              </span>
            </span>

            <span
              className="mt-0.5 px-2.5 relative z-10 -mx-1 inline-grid place-items-center"
              aria-hidden="true"
            >
              {/* Shadow layer */}
              <span className="font-sans col-start-1 row-start-1 rotate-[4deg] scale-[1.32] text-[28px] font-light text-background blur-[1px]">
                /
              </span>
              {/* Indigo gradient layer */}
              <span className="font-sans col-start-1 row-start-1 rotate-[4deg] text-[28px] font-light bg-clip-text text-transparent bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600 dark:from-indigo-300 dark:via-indigo-400 dark:to-indigo-500">
                /
              </span>
            </span>

            {/* BUILDERS clip wrapper */}
            <span className="overflow-hidden inline-block relative z-0 -ml-3 py-2 -my-2">
              <span
                className="block text-[0.85em] text-muted-foreground motion-reduce:transform-none"
                style={{
                  transform: "translateX(-1.6rem) translateY(0.5rem)",
                  animation:
                    "logo-builders-in 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
                }}
              >
                BUILDERS
              </span>
            </span>
          </span>
        </>
      )}
    </div>
  );
}
