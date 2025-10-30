'use client';

import React, { useState } from 'react';
import { useOsAlternatives } from '../lib/hooks';
import { OsAlternativesHeroSection } from '../components/alternatives/OsAlternativesHeroSection';
import { EventsSection } from '../components/alternatives/EventsSection';
import NoiseBackground from '../components/alternatives/NoiseBackground';
import StatsCard from '../components/alternatives/StatsCard';
import { DataTableDrawer } from '@/components/ui/DataTableDrawer';
import { useSelectedCapabilities, useCapabilityActions } from '@/hooks/use-capabilities-config';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-keys';
import { makeGraphQLRequest } from '../lib/graphql/client';

interface OsAlternativesPageClientProps {
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

export function OsAlternativesPageClient({ slug }: OsAlternativesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedCapabilities = useSelectedCapabilities();
  const { addCapability, removeCapability } = useCapabilityActions();

  // This data is already prefetched by server, so it loads instantly
  const { data: osAlternativesData, error: osAlternativesError } = useOsAlternatives(slug);

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
  if (osAlternativesError || !osAlternativesData) {
    return (
      <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-50 to-red-100" />
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load OS alternatives</p>
            <p className="text-muted-foreground text-sm">
              {osAlternativesError?.message || 'Open source application not found or not marked as an alternative'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { openSourceApp, proprietaryApp, otherAlternatives } = osAlternativesData;

  return (
    <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
      {/* Full-page noise background */}
      <div className="absolute inset-0 w-full h-full">
        <NoiseBackground 
          color={openSourceApp.simpleIconColor || "#10b981"}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <OsAlternativesHeroSection 
          openSourceApp={openSourceApp}
          proprietaryApp={proprietaryApp}
        />
        <div className="mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8 max-w-5xl">
          <div className="md:w-2/3">
            <EventsSection 
              alternatives={otherAlternatives}
              proprietaryCapabilities={proprietaryApp.capabilities}
            />
          </div>
          <div className="md:w-1/3 space-y-6">
            <StatsCard
              capabilities={proprietaryApp.capabilities}
              openSourceAlternatives={otherAlternatives}
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