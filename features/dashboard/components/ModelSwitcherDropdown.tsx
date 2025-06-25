"use client";

import { Folders } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMeta } from "@/features/dashboard/hooks/useAdminMeta";

interface ModelSwitcherDropdownProps {
  title?: string;
  basePath: string;
}

function ModelSwitcherDropdownContent({ basePath }: { basePath: string }) {
  const { adminMeta, isLoading, error } = useAdminMeta();

  if (isLoading) {
    return (
      <DropdownMenuContent
        align="start"
        className="w-48 overflow-y-auto max-h-72"
      >
        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
      </DropdownMenuContent>
    );
  }

  if (error) {
    console.error("Error loading admin meta:", error);
    return (
      <DropdownMenuContent
        align="start"
        className="w-48 overflow-y-auto max-h-72"
      >
        <DropdownMenuItem disabled>Error loading items</DropdownMenuItem>
      </DropdownMenuContent>
    );
  }

  // Calculate navItems from adminMeta
  const navItems = adminMeta
    ? Object.values(adminMeta.lists)
        .filter((list) => !list.hideNavigation)
        .map((list) => ({
          label: list.label,
          href: `${basePath}/${list.path}${list.isSingleton ? "/1" : ""}`,
        }))
    : [];

  if (navItems.length === 0) {
    return (
      <DropdownMenuContent
        align="start"
        className="w-48 overflow-y-auto max-h-72"
      >
        <DropdownMenuItem disabled>No items available</DropdownMenuItem>
      </DropdownMenuContent>
    );
  }

  return (
    <DropdownMenuContent
      align="start"
      className="w-48 overflow-y-auto max-h-72"
    >
      {navItems.map((item) => (
        <DropdownMenuItem key={item.href} asChild>
          <Link href={item.href}>{item.label}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );
}

export function ModelSwitcherDropdown({ title, basePath }: ModelSwitcherDropdownProps) {
  const { isLoading } = useAdminMeta();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        {title && <span className="mr-1">{title}</span>}
        <Skeleton className="h-5 w-5 rounded-sm" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          {title && <span className="mr-1">{title}</span>}
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5 rounded-sm"
          >
            <Folders className="size-3"/>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <ModelSwitcherDropdownContent basePath={basePath} />
    </DropdownMenu>
  );
}