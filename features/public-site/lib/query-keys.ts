// Centralized query key factory for type safety and consistency
export const queryKeys = {
  // Popular apps
  popularApps: {
    all: ['popularApps'] as const,
    list: () => [...queryKeys.popularApps.all, 'list'] as const,
  },

  // Proprietary applications
  proprietaryApps: {
    all: ['proprietaryApps'] as const,
    lists: () => [...queryKeys.proprietaryApps.all, 'list'] as const,
    details: () => [...queryKeys.proprietaryApps.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.proprietaryApps.details(), slug] as const,
    alternatives: (slug: string) => [...queryKeys.proprietaryApps.all, 'alternatives', slug] as const,
  },

  // Open source applications
  openSourceApps: {
    all: ['openSourceApps'] as const,
    lists: () => [...queryKeys.openSourceApps.all, 'list'] as const,
    list: () => [...queryKeys.openSourceApps.all, 'list'] as const,
    details: () => [...queryKeys.openSourceApps.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.openSourceApps.details(), slug] as const,
  },

  // OS alternatives - used for "osApps" in query keys for consistency
  osApps: {
    all: ['osApps'] as const,
    alternatives: (slug: string) => [...queryKeys.osApps.all, 'alternatives', slug] as const,
  },

  // Search
  search: {
    all: ['search'] as const,
    multiModel: (query: string) => [...queryKeys.search.all, 'multiModel', query] as const,
  },

  // Capabilities
  capabilities: {
    all: ['capabilities'] as const,
    lists: () => [...queryKeys.capabilities.all, 'list'] as const,
    list: () => [...queryKeys.capabilities.all, 'list'] as const,
    search: (query: string) => [...queryKeys.capabilities.all, 'search', query] as const,
    applications: (slug: string) => [...queryKeys.capabilities.all, 'applications', slug] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;