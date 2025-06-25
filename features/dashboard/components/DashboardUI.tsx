"use client";

import { AppSidebar } from '@/features/dashboard/components/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: {
    canAccessDashboard?: boolean;
    [key: string]: any;
  };
}

interface DashboardUIProps {
  children: React.ReactNode;
  sidebarLinks?: Array<{ title: string; href: string }>;
  user?: User | null;
}

export function DashboardUI({ children, sidebarLinks = [], user }: DashboardUIProps) {
  return (
    <SidebarProvider>
      <AppSidebar sidebarLinks={sidebarLinks} user={user} />
      <SidebarInset className="min-w-0">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
} 