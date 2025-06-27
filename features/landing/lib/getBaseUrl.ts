/**
 * Get the base URL for the application dynamically
 * Simplified for client-side usage only
 */
export function getBaseUrl(): string {
  // Client-side: use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Production fallback - return empty string and let relative URLs work
  return '';
}

/**
 * Get the GraphQL endpoint URL
 */
export function getGraphQLEndpoint(): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/graphql`;
}