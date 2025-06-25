'use client';

import React from 'react';
import { SWRConfig } from 'swr';
import { enhanceListClient } from '@/features/dashboard/lib/enhanceList';
import { DashboardUI } from '@/features/dashboard/components/DashboardUI';
import type { AdminMeta } from '@/features/dashboard/types';
import { basePath } from '@/features/dashboard/lib/config';

// Define the SWR key used by the useAdminMeta hook
const adminMetaSWRKey = 'keystoneAdminMeta';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AdminMetaProviderProps {
  adminMeta: AdminMeta;
  user?: User | null;
  children: React.ReactNode;
}

export function AdminMetaProvider({ adminMeta, user, children }: AdminMetaProviderProps) {
  // Enhance all lists once when initializing the provider
  const enhancedAdminMeta = React.useMemo(() => {
    // Explicitly type the enhanced object to match AdminMeta structure
    const enhanced: AdminMeta = {
      ...adminMeta,
      lists: {}, // Initialize as empty, but retain the Record<string, ListMeta> type
      listsByPath: {} // Initialize as empty, but retain the Record<string, ListMeta> type
    };

    // Enhance each list once
    Object.entries(adminMeta.lists).forEach(([key, list]) => {
      try {
        // Enhanced list with client-side controllers and views
        const enhancedList = enhanceListClient(list);
        enhanced.lists[key] = enhancedList;
        enhanced.listsByPath[list.path] = enhancedList;
      } catch (enhanceError) {
        console.error(`Error enhancing list "${key}":`, enhanceError);
        // Fall back to using the unenhanced list if enhancement fails
        enhanced.lists[key] = list;
        enhanced.listsByPath[list.path] = list;
      }
    });

    return enhanced;
  }, [adminMeta]);

  // Prepare the fallback data for SWR with stringified key and enhanced meta
  const fallback = {
    [adminMetaSWRKey]: enhancedAdminMeta,
  };

  const sidebarLinks = React.useMemo(() => {

    // Then, add links from admin meta lists
    const modelLinks = Object.values(enhancedAdminMeta.lists)
      .filter(list => !list.hideNavigation) // Filter out hidden lists
      .map(list => ({
        title: list.label,
        href: `${basePath}/${list.path}${list.isSingleton ? "/1" : ""}`,
      }));

    // Return all links
    return [...modelLinks];
  }, [enhancedAdminMeta]);

  return (
    <SWRConfig value={{ fallback }}>
      <DashboardUI sidebarLinks={sidebarLinks} user={user}>
        {children}
      </DashboardUI>
    </SWRConfig>
  );
}