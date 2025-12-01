'use client';

import React, { useState } from 'react';
import { useCapabilityApplications } from '../lib/hooks';
import { CapabilitiesHeroSection } from '../components/alternatives/CapabilitiesHeroSection';
import { EventsSection } from '../components/alternatives/EventsSection';
import StatsCard from '../components/alternatives/StatsCard';
import { DataTableDrawer } from '@/components/ui/DataTableDrawer';
import { useSelectedCapabilities, useCapabilityActions } from '@/hooks/use-capabilities-config';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';

interface CapabilitiesPageClientProps {
  slug: string;
  // Data is prefetched by server and available immediately via React Query cache
}

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      repositoryUrl
      websiteUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`;

export function CapabilitiesPageClient({ slug }: CapabilitiesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedCapabilities = useSelectedCapabilities();
  const { addCapability, removeCapability } = useCapabilityActions();

  // This data is already prefetched by server, so it loads instantly
  const { data: capabilityData, error: capabilityError } = useCapabilityApplications(slug);

  // Use React Query for all open source apps (for drawer)
  const { data: apps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const handleSelectedCapabilitiesChange = (capabilities: any) => {
    // This is called when capabilities are changed from the BuildStatsCard - but we use the provider now
    // The provider will automatically handle the sync through the context
    console.log('Capability change handled by provider', capabilities);
  };

  // Since data is prefetched, this should never show loading
  // But handle error state  
  if (capabilityError || !capabilityData) {
    return (
      <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-50 to-red-100" />
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load capability applications</p>
            <p className="text-muted-foreground text-sm">
              {capabilityError?.message || 'Capability not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { capability, proprietaryApplications, openSourceApplications } = capabilityData;

  return (
    <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
      {/* Content */}
      <div className="relative">
        <CapabilitiesHeroSection 
          capability={capability}
        />
        <div className="mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8 max-w-5xl">
          <div className="md:w-2/3">
            <EventsSection 
              alternatives={openSourceApplications}
              proprietaryCapabilities={[capability]}
              title="Applications"
            />
          </div>
          <div className="md:w-1/3 space-y-6">
            <StatsCard
              capabilities={[capability]}
              openSourceAlternatives={openSourceApplications}
              onOpenDrawer={() => setDrawerOpen(true)}
              apps={apps}
            />
          </div>
        </div>
      </div>
      
      <DataTableDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        apps={apps}
        selectedCapabilities={selectedCapabilities}
        onSelectedCapabilitiesChange={handleSelectedCapabilitiesChange}
      />
    </div>
  );
}