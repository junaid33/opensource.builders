// Core application types
export interface PopularApp {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  simpleIconSlug: string | null;
  simpleIconColor: string | null;
  openSourceAlternativesCount: number;
}

export interface Capability {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  complexity?: string;
}

export interface OpenSourceApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  githubStars?: number;
  githubForks?: number;
  license?: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities: Array<{
    capability: Capability;
    implementationNotes?: string;
    githubPath?: string;
    documentationUrl?: string;
    implementationComplexity?: string;
    isActive?: boolean;
  }>;
}

export interface ProprietaryApplication {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  openSourceAlternatives: OpenSourceApplication[];
  capabilities: Capability[];
}

// Search result types
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
    category?: string;
    complexity?: string;
  }>;
}

// API Response types
export interface PopularAppsResponse {
  proprietaryApplications: PopularApp[];
}

export interface AlternativesResponse {
  proprietaryApplications: ProprietaryApplication[];
}