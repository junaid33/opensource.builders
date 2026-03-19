"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PortalProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Portal({ children, className, id }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-[100]", className)} id={id}>
      {children}
    </div>,
    document.body
  );
}

export function PortalBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
    />
  );
}
