import { GraphQLClient } from 'graphql-request';

// Function to get base URL dynamically (following bulletproof React pattern)
async function getBaseUrl(): Promise<string> {
  if (typeof window !== 'undefined') {
    // Client-side: use window.location
    return window.location.origin;
  }
  
  // Server-side: dynamically import next/headers
  if (typeof process !== 'undefined') {
    try {
      // Dynamic import next/headers only on server-side
      const { headers } = await import('next/headers');
      const headersList = await headers();
      
      // Try x-forwarded-host first (common in production deployments)
      const host = headersList.get('x-forwarded-host') || headersList.get('host');
      const protocol = headersList.get('x-forwarded-proto') || 'http';
      
      if (host) {
        return `${protocol}://${host}`;
      }
    } catch (e) {
      // headers() might not be available in all contexts (e.g., API routes)
      // Fall through to default
    }
  }
  
  return 'http://localhost:3005';
}

// Single data fetching function used by both server prefetch and client useQuery
export async function makeGraphQLRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    // Get the proper endpoint dynamically
    const baseUrl = await getBaseUrl();
    const endpoint = `${baseUrl}/api/graphql`;
    
    const client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await client.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error; // Let React Query handle the error
  }
}