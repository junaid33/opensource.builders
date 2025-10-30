// TypeScript interfaces for public site

export interface Capability {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  complexity: string;
}

export interface OpenSourceCapability {
  capability: Capability;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity: string;
  isActive: boolean;
}

export interface OpenSourceApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  githubStars: number;
  githubForks: number;
  license?: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities?: OpenSourceCapability[];
}

export interface ProprietaryApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities: Capability[];
  openSourceAlternatives: OpenSourceApplication[];
}

export interface PopularApp {
  id: string;
  name: string;
  slug: string;
  description?: string;
  websiteUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  openSourceAlternativesCount?: number;
}

// Response types for GraphQL queries
export interface PopularAppsResponse {
  proprietaryApplications: PopularApp[];
}

export interface AlternativesResponse {
  proprietaryApplications: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    websiteUrl?: string;
    simpleIconSlug?: string;
    simpleIconColor?: string;
    capabilities: {
      capability: Capability;
    }[];
    openSourceAlternatives: Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      githubStars?: number;
      githubForks?: number;
      license?: string;
      websiteUrl?: string;
      repositoryUrl?: string;
      simpleIconSlug?: string;
      simpleIconColor?: string;
      capabilities: {
        capability: Capability;
        implementationNotes?: string;
        githubPath?: string;
        documentationUrl?: string;
        implementationComplexity: string;
        isActive: boolean;
      }[];
    }>;
  }[];
}

export interface SearchResult {
  openSourceApplications: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    simpleIconSlug?: string;
    simpleIconColor?: string;
    repositoryUrl?: string;
    websiteUrl?: string;
  }>;
  proprietaryApplications: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    simpleIconSlug?: string;
    simpleIconColor?: string;
    websiteUrl?: string;
  }>;
  capabilities: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    category: string;
    complexity: string;
  }>;
}

// New types for OS alternatives and capabilities pages
export interface OpenSourceApplicationWithCapability {
  id: string;
  name: string;
  slug: string;
  description: string;
  githubStars: number;
  githubForks: number;
  license?: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity: string;
  isActive: boolean;
}

export interface CapabilityApplicationsResponse {
  capability: Capability;
  proprietaryApplications: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl?: string;
    simpleIconSlug?: string;
    simpleIconColor?: string;
  }>;
  openSourceApplications: OpenSourceApplicationWithCapability[];
}

// Response types for new queries
export interface AllCapabilitiesResponse {
  capabilities: Capability[];
}

export interface AllOpenSourceAppsResponse {
  openSourceApplications: OpenSourceApplication[];
}