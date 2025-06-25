"use client";

import * as React from "react";
import {
  ChevronRight,
  LayoutDashboard,
  ArrowUpRight,
  Sparkles,
  Package,
  Users,
  Tag,
  Gift,
  BadgeDollarSign,
  Clipboard,
  BarChart3,
  LayoutList,
  ArrowLeftRight,
  ShieldCheck,
  Truck,
  Settings,
  Ticket,
} from "lucide-react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Removed unused useTheme import
import { Logo, LogoIcon } from '@/features/dashboard/components/Logo';
import { basePath } from "@/features/dashboard/lib/config";
import { LucideIcon } from "lucide-react";
import { UserProfileClient } from "@/features/dashboard/components/UserProfileClient";
import type { User } from "@/features/dashboard/components/DashboardUI";

interface AppSidebarProps {
  sidebarLinks: Array<{ title: string; href: string }>;
  user?: User | null;
}

export function AppSidebar({ sidebarLinks = [], user }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  // Function to check if a link is active
  const isLinkActive = React.useCallback(
    (href: string) => {
      if (!pathname) return false;

      // Exact match for dashboard root
      if (
        href === `${basePath}/dashboard` &&
        pathname === `${basePath}/dashboard`
      ) {
        return true;
      }

      // For other pages, check if the pathname starts with the href
      // This handles nested routes like /dashboard/products/1
      if (href !== `${basePath}/dashboard`) {
        return pathname.startsWith(href);
      }

      return false;
    },
    [pathname]
  );

  // Dashboard items for the collapsible menu
  const dashboardItems = [
    {
      title: "Models",
      items: sidebarLinks,
      isActive: false,
      icon: Package,
    },
  ];

  // Note: We're not using a home link in the current implementation
  // but keeping the structure for future reference

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton asChild>
          <div className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden p-2">
            <Logo />
          </div>
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <div className="hidden group-has-[[data-collapsible=icon]]/sidebar-wrapper:block">
            <LogoIcon />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        {/* Main Navigation */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((route) => (
              <SidebarMenuItem key={route.url}>
                <SidebarMenuButton asChild>
                  <Link href={route.url} onClick={() => setOpenMobile(false)}>
                    {route.icon && <route.icon className="h-4 w-4 stroke-2" />}
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup> */}

        {/* Dashboard Links - Collapsible/Dropdown */}
        {dashboardItems.map((dashboardItem) => (
          <SidebarGroup key={dashboardItem.title}>
            <SidebarGroupLabel>{dashboardItem.title}</SidebarGroupLabel>
            <div className="max-h-full overflow-y-auto group-has-[[data-collapsible=icon]]/sidebar-wrapper:hidden">
              <Collapsible
                key={dashboardItem.title}
                asChild
                defaultOpen={dashboardItem.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <dashboardItem.icon className="h-4 w-4" />
                      <span>{dashboardItem.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {dashboardItem.items.map((link) => {
                        const handleClick = (e: React.MouseEvent) => {
                          setOpenMobile(false);
                        };

                        return (
                          <SidebarMenuSubItem key={link.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isLinkActive(link.href)}
                            >
                              <Link href={link.href} onClick={handleClick}>
                                <span>{link.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </div>

            <div className="hidden group-has-[[data-collapsible=icon]]/sidebar-wrapper:block">
              <DropdownMenu>
                <SidebarMenuItem>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <dashboardItem.icon className="h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56"
                  >
                    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto py-1">
                      {dashboardItem.items.map((link) => {
                        const handleClick = (e: React.MouseEvent) => {
                          setOpenMobile(false);
                        };

                        return (
                          <DropdownMenuItem
                            asChild
                            key={link.href}
                            className={
                              isLinkActive(link.href)
                                ? "bg-blue-50 text-blue-600"
                                : ""
                            }
                          >
                            <Link href={link.href} onClick={handleClick}>
                              <span>{link.title}</span>
                              {isLinkActive(link.href) && (
                                <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </SidebarMenuItem>
              </DropdownMenu>
            </div>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{user && <UserProfileClient user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
