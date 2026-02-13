// Single data functions used by both server prefetch and client useQuery
import { cache } from 'react';
import { makeGraphQLRequest } from './graphql/client';
import { GET_POPULAR_APPS, GET_ALTERNATIVES, GET_ALL_PROPRIETARY_APPS, MULTI_MODEL_SEARCH, GET_OS_ALTERNATIVES, GET_CAPABILITY_APPLICATIONS, GET_ALL_CAPABILITIES, GET_ALL_OPEN_SOURCE_APPS, GET_PAGINATED_ALTERNATIVES } from './graphql/queries';
import { PopularAppsResponse, AlternativesResponse, SearchResult, PopularApp, ProprietaryApplication, OpenSourceApplication, CapabilityApplicationsResponse, AllCapabilitiesResponse, AllOpenSourceAppsResponse, Capability } from '../types';

export const OPEN_SOURCE_APP_NOT_FOUND_ERROR = 'Open source application not found';
export const OS_APP_NOT_MARKED_AS_ALTERNATIVE_ERROR = 'This open source application is not marked as an alternative to any proprietary application';

export function isExpectedOsAlternativesError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.message === OPEN_SOURCE_APP_NOT_FOUND_ERROR ||
    error.message === OS_APP_NOT_MARKED_AS_ALTERNATIVE_ERROR
  );
}

// Fetch popular apps
export const fetchPopularApps = cache(async function (): Promise<PopularApp[]> {
  const data = await makeGraphQLRequest<PopularAppsResponse>(GET_POPULAR_APPS);
  return data.proprietaryApplications;
});

// Fetch all proprietary apps
export const fetchAllProprietaryApps = cache(async function (): Promise<PopularApp[]> {
  const data = await makeGraphQLRequest<PopularAppsResponse>(GET_ALL_PROPRIETARY_APPS);
  return data.proprietaryApplications;
});

// Fetch alternatives for a proprietary app
export const fetchAlternatives = cache(async function (slug: string): Promise<ProprietaryApplication> {
  const data = await makeGraphQLRequest<AlternativesResponse>(GET_ALTERNATIVES, { slug });
  
  const proprietaryApps = data.proprietaryApplications;
  
  if (!proprietaryApps || proprietaryApps.length === 0) {
    throw new Error('Proprietary application not found');
  }

  // Transform the response to match our interface
  const proprietaryApp: ProprietaryApplication = {
    id: proprietaryApps[0].id,
    name: proprietaryApps[0].name,
    slug: proprietaryApps[0].slug,
    description: proprietaryApps[0].description || '',
    websiteUrl: proprietaryApps[0].websiteUrl,
    simpleIconSlug: proprietaryApps[0].simpleIconSlug,
    simpleIconColor: proprietaryApps[0].simpleIconColor,
    capabilities: (() => {
      const capabilityMap = new Map();
      proprietaryApps[0].capabilities?.forEach((pc: any) => {
        const capability = {
          id: pc.capability.id,
          name: pc.capability.name,
          slug: pc.capability.slug,
          description: pc.capability.description || '',
          category: pc.capability.category,
          complexity: pc.capability.complexity,
        };
        // Use capability ID as key to deduplicate
        capabilityMap.set(capability.id, capability);
      });
      return Array.from(capabilityMap.values());
    })(),
    openSourceAlternatives: proprietaryApps[0].openSourceAlternatives.map((alt: any) => ({
      id: alt.id,
      name: alt.name,
      slug: alt.slug,
      description: alt.description || '',
      githubStars: alt.githubStars || 0,
      githubForks: alt.githubForks || 0,
      license: alt.license,
      websiteUrl: alt.websiteUrl,
      repositoryUrl: alt.repositoryUrl,
      simpleIconSlug: alt.simpleIconSlug,
      simpleIconColor: alt.simpleIconColor,
      capabilities: alt.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    })),
  };

  return proprietaryApp;
});

// Fetch search results
export const fetchSearchResults = cache(async function (searchQuery: string): Promise<SearchResult> {
  const data = await makeGraphQLRequest<SearchResult>(MULTI_MODEL_SEARCH, { search: searchQuery });
  return data;
});

// Fetch OS alternatives - show other open source alternatives to the same proprietary app
export const fetchOsAlternatives = cache(async function (slug: string): Promise<{ 
  openSourceApp: OpenSourceApplication; 
  proprietaryApp: ProprietaryApplication; 
  otherAlternatives: OpenSourceApplication[];
}> {
  const data = await makeGraphQLRequest<{ openSourceApplications: any[] }>(GET_OS_ALTERNATIVES, { slug });
  
  const openSourceApps = data.openSourceApplications;
  
  if (!openSourceApps || openSourceApps.length === 0) {
    throw new Error(OPEN_SOURCE_APP_NOT_FOUND_ERROR);
  }

  const openSourceApp = openSourceApps[0];
  
  if (!openSourceApp.primaryAlternativeTo) {
    throw new Error(OS_APP_NOT_MARKED_AS_ALTERNATIVE_ERROR);
  }

  const proprietaryApp = openSourceApp.primaryAlternativeTo;
  
  // Get other alternatives (exclude the current app)
  const otherAlternatives = proprietaryApp.openSourceAlternatives?.filter((alt: any) => alt.id !== openSourceApp.id) || [];

  return {
    openSourceApp: {
      id: openSourceApp.id,
      name: openSourceApp.name,
      slug: openSourceApp.slug,
      description: openSourceApp.description || '',
      githubStars: openSourceApp.githubStars || 0,
      githubForks: openSourceApp.githubForks || 0,
      license: openSourceApp.license,
      websiteUrl: openSourceApp.websiteUrl,
      repositoryUrl: openSourceApp.repositoryUrl,
      simpleIconSlug: openSourceApp.simpleIconSlug,
      simpleIconColor: openSourceApp.simpleIconColor,
      capabilities: openSourceApp.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    },
    proprietaryApp: {
      id: proprietaryApp.id,
      name: proprietaryApp.name,
      slug: proprietaryApp.slug,
      description: proprietaryApp.description || '',
      websiteUrl: proprietaryApp.websiteUrl,
      simpleIconSlug: proprietaryApp.simpleIconSlug,
      simpleIconColor: proprietaryApp.simpleIconColor,
      capabilities: proprietaryApp.capabilities?.map((pc: any) => ({
        id: pc.capability.id,
        name: pc.capability.name,
        slug: pc.capability.slug,
        description: pc.capability.description || '',
        category: pc.capability.category,
        complexity: pc.capability.complexity,
      })) || [],
      openSourceAlternatives: [],
    },
    otherAlternatives: otherAlternatives.map((alt: any) => ({
      id: alt.id,
      name: alt.name,
      slug: alt.slug,
      description: alt.description || '',
      githubStars: alt.githubStars || 0,
      githubForks: alt.githubForks || 0,
      license: alt.license,
      websiteUrl: alt.websiteUrl,
      repositoryUrl: alt.repositoryUrl,
      simpleIconSlug: alt.simpleIconSlug,
      simpleIconColor: alt.simpleIconColor,
      capabilities: alt.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    })),
  };
});

// Fetch all applications that have a specific capability
export const fetchCapabilityApplications = cache(async function (slug: string): Promise<CapabilityApplicationsResponse> {
  const data = await makeGraphQLRequest<{ capabilities: any[] }>(GET_CAPABILITY_APPLICATIONS, { slug });
  
  const capabilities = data.capabilities;
  
  if (!capabilities || capabilities.length === 0) {
    throw new Error('Capability not found');
  }

  const capability = capabilities[0];
  
  return {
    capability: {
      id: capability.id,
      name: capability.name,
      slug: capability.slug,
      description: capability.description || '',
      category: capability.category,
      complexity: capability.complexity,
    },
    proprietaryApplications: capability.proprietaryApplications?.map((app: any) => ({
      id: app.proprietaryApplication.id,
      name: app.proprietaryApplication.name,
      slug: app.proprietaryApplication.slug,
      description: app.proprietaryApplication.description || '',
      websiteUrl: app.proprietaryApplication.websiteUrl,
      simpleIconSlug: app.proprietaryApplication.simpleIconSlug,
      simpleIconColor: app.proprietaryApplication.simpleIconColor,
    })) || [],
    openSourceApplications: capability.openSourceApplications?.map((app: any) => ({
      id: app.openSourceApplication.id,
      name: app.openSourceApplication.name,
      slug: app.openSourceApplication.slug,
      description: app.openSourceApplication.description || '',
      githubStars: app.openSourceApplication.githubStars || 0,
      githubForks: app.openSourceApplication.githubForks || 0,
      license: app.openSourceApplication.license,
      websiteUrl: app.openSourceApplication.websiteUrl,
      repositoryUrl: app.openSourceApplication.repositoryUrl,
      simpleIconSlug: app.openSourceApplication.simpleIconSlug,
      simpleIconColor: app.openSourceApplication.simpleIconColor,
      implementationNotes: app.implementationNotes,
      githubPath: app.githubPath,
      documentationUrl: app.documentationUrl,
      implementationComplexity: app.implementationComplexity,
      isActive: app.isActive,
    })) || [],
  };
});

// Fetch all capabilities
export const fetchAllCapabilities = cache(async function (): Promise<Capability[]> {
  const data = await makeGraphQLRequest<AllCapabilitiesResponse>(GET_ALL_CAPABILITIES);
  return data.capabilities;
});

// Fetch all open source applications
export const fetchAllOpenSourceApps = cache(async function (): Promise<OpenSourceApplication[]> {
  const data = await makeGraphQLRequest<AllOpenSourceAppsResponse>(GET_ALL_OPEN_SOURCE_APPS);
  return data.openSourceApplications;
});

// Fetch paginated alternatives for hero section
export interface PaginatedAlternativesResponse {
  alternatives: OpenSourceApplication[];
  totalCount: number;
  capabilities: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    complexity: string;
  }>;
}

export async function fetchPaginatedAlternatives(
  slug: string,
  take: number,
  skip: number
): Promise<PaginatedAlternativesResponse> {
  const data = await makeGraphQLRequest<any>(GET_PAGINATED_ALTERNATIVES, { slug, take, skip });

  const proprietaryApps = data.proprietaryApplications;

  if (!proprietaryApps || proprietaryApps.length === 0) {
    return { alternatives: [], totalCount: 0, capabilities: [] };
  }

  const proprietaryApp = proprietaryApps[0];

  // Deduplicate capabilities
  const capabilityMap = new Map();
  proprietaryApp.capabilities?.forEach((pc: any) => {
    const capability = {
      id: pc.capability.id,
      name: pc.capability.name,
      slug: pc.capability.slug,
      description: pc.capability.description || '',
      category: pc.capability.category,
      complexity: pc.capability.complexity,
    };
    capabilityMap.set(capability.id, capability);
  });

  return {
    alternatives: proprietaryApp.openSourceAlternatives?.map((alt: any) => ({
      id: alt.id,
      name: alt.name,
      slug: alt.slug,
      description: alt.description || '',
      githubStars: alt.githubStars || 0,
      githubForks: alt.githubForks || 0,
      license: alt.license,
      websiteUrl: alt.websiteUrl,
      repositoryUrl: alt.repositoryUrl,
      simpleIconSlug: alt.simpleIconSlug,
      simpleIconColor: alt.simpleIconColor,
      capabilities: alt.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    })) || [],
    totalCount: proprietaryApp.openSourceAlternativesCount || 0,
    capabilities: Array.from(capabilityMap.values()),
  };
}

// Fetch all categories
export const fetchAllCategories = cache(async function (): Promise<any[]> {
  try {
    const { GET_ALL_CATEGORIES } = await import('./graphql/queries');
    const data = await makeGraphQLRequest<{ categories: any[] }>(GET_ALL_CATEGORIES);
    return data.categories;
  } catch (error) {
    console.error('fetchAllCategories failed:', error);
    return [];
  }
});

// Fetch category details
export const fetchCategoryDetails = cache(async function (slug: string): Promise<any> {
  try {
    const { GET_CATEGORY_DETAILS } = await import('./graphql/queries');
    const data = await makeGraphQLRequest<{ categories: any[] }>(GET_CATEGORY_DETAILS, { slug });
    
    if (!data.categories || data.categories.length === 0) {
      throw new Error('Category not found');
    }
    
    return data.categories[0];
  } catch (error) {
    console.error(`fetchCategoryDetails for ${slug} failed:`, error);
    throw error; // Still throw for detail page so notFound() can be triggered if appropriate
  }
});

// Application type for comparison (can be either proprietary or open source)
export interface ComparisonApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  license?: string;
  githubStars?: number;
  githubForks?: number;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  isOpenSource: boolean;
  capabilities: Array<{
    capability: {
      id: string;
      name: string;
      slug: string;
      description: string;
      category?: string;
      complexity?: string;
    };
    implementationNotes?: string;
    githubPath?: string;
    documentationUrl?: string;
    implementationComplexity?: string;
    isActive?: boolean;
  }>;
}

// Fetch application by slug (either proprietary or open source)
export const fetchApplicationBySlug = cache(async function (slug: string): Promise<ComparisonApplication | null> {
  const { GET_APPLICATION_BY_SLUG } = await import('./graphql/compare-queries');
  const data = await makeGraphQLRequest<{
    proprietaryApplications: any[];
    openSourceApplications: any[];
  }>(GET_APPLICATION_BY_SLUG, { slug });

  // Check open source first (more common use case)
  if (data.openSourceApplications && data.openSourceApplications.length > 0) {
    const app = data.openSourceApplications[0];
    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      description: app.description || '',
      websiteUrl: app.websiteUrl,
      repositoryUrl: app.repositoryUrl,
      license: app.license,
      githubStars: app.githubStars,
      githubForks: app.githubForks,
      simpleIconSlug: app.simpleIconSlug,
      simpleIconColor: app.simpleIconColor,
      isOpenSource: true,
      capabilities: app.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    };
  }

  // Check proprietary
  if (data.proprietaryApplications && data.proprietaryApplications.length > 0) {
    const app = data.proprietaryApplications[0];
    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      description: app.description || '',
      websiteUrl: app.websiteUrl,
      simpleIconSlug: app.simpleIconSlug,
      simpleIconColor: app.simpleIconColor,
      isOpenSource: false,
      capabilities: app.capabilities?.map((c: any) => ({
        capability: {
          id: c.capability.id,
          name: c.capability.name,
          slug: c.capability.slug,
          description: c.capability.description || '',
          category: c.capability.category,
          complexity: c.capability.complexity,
        },
      })) || [],
    };
  }

  return null;
});