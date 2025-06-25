import Link from "next/link";
import { basePath } from "@/features/dashboard/lib/config";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
interface CellLinkProps {
  href: string;
  children: ReactNode;
}

export function CellLink({ href, children }: CellLinkProps) {
  return (
    <Button variant="link" asChild className="p-0">
      <Link
        href={`${basePath}${href}`}
      >
        {children}
      </Link>
    </Button>
  );
} 