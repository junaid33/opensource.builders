/**
 * Dashboard2Layout - Main layout component inspired by Keystone with ShadCN UI styling
 * Combines Keystone's admin UI patterns with Dashboard 1's design system
 */

'use client'

import React from 'react'
import { AdminMetaProvider } from '../hooks/useAdminMeta'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Sidebar } from './Sidebar'
import { ErrorBoundary } from './ErrorBoundary'
import { DashboardProvider } from '../context/DashboardProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
  adminMeta?: any
  authenticatedItem?: any
  router?: any
}

export function DashboardLayout({ children, adminMeta, authenticatedItem, router }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <AdminMetaProvider>
          <SidebarProvider>
            <Sidebar adminMeta={adminMeta} />
            <SidebarInset className="min-w-0">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </AdminMetaProvider>
      </DashboardProvider>
    </ErrorBoundary>
  )
}

export default DashboardLayout