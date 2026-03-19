"use client";

import { DataTableDrawer } from "@/components/ui/DataTableDrawer";
import { useBuildStatsCardState } from "@/hooks/use-capabilities-config";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/public-site/lib/query-keys";
import { makeGraphQLRequest } from "@/features/public-site/lib/graphql/client";

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(orderBy: { name: asc }) {
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

export function GlobalDataTableDrawer() {
  const { buildStatsCard, updateBuildStatsCard } = useBuildStatsCardState();
  const isOpen = buildStatsCard.isDrawerOpen;

  const { data: apps = [] } = useQuery({
    queryKey: queryKeys.openSourceApps.lists(),
    queryFn: async () => {
      const result = await makeGraphQLRequest<{ openSourceApplications: any[] }>(GET_ALL_OPEN_SOURCE_APPS);
      return result.openSourceApplications;
    },
    enabled: isOpen, // Only fetch when needed
    staleTime: 10 * 60 * 1000,
  });

  return (
    <DataTableDrawer
      open={isOpen}
      onOpenChange={(open) => updateBuildStatsCard({ isDrawerOpen: open })}
      apps={apps}
    />
  );
}
