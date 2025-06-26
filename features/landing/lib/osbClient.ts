/**
 * OSB (Open Source Builders) GraphQL client for public landing page
 * Simplified version without authentication for public queries
 */

import { GraphQLClient, ClientError } from 'graphql-request';
import { getGraphQLEndpoint } from './getBaseUrl';

// Define response type for osbClient
export type OSBResponse<T = any> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; errors?: any[]; data?: never };

/**
 * Create a GraphQL client for public queries
 */
async function createGraphQLClient(): Promise<GraphQLClient> {
  const endpoint = await getGraphQLEndpoint();
  return new GraphQLClient(endpoint, {
    credentials: 'include',
  });
}

/**
 * Format GraphQL error messages in a more readable way
 */
function formatGraphQLErrors(error: ClientError): { message: string; errors?: any[] } {
  if (!error.response) {
    return { message: error.message };
  }

  const errors = error.response.errors;
  if (!errors) {
    return { message: error.message };
  }

  // Extract detailed error information
  const formattedErrors = errors.map(err => {
    const extensions = err.extensions || {};
    const path = err.path?.join('.') || '';
    const code = extensions.code || '';
    
    // Get original error if available
    const originalError = extensions.originalError?.message || extensions.exception?.message || '';
    
    // Include validation errors if present
    const validation = extensions.validation || {};
    const validationErrors = Object.entries(validation)
      .map(([field, error]) => `${field}: ${error}`)
      .join(', ');

    // Build detailed error message
    const details = [
      originalError && `Original Error: ${originalError}`,
      path && `Path: ${path}`,
      code && `Code: ${code}`,
      validationErrors && `Validation: ${validationErrors}`
    ].filter(Boolean).join(' | ');

    return {
      message: err.message,
      details: details || undefined
    };
  });

  // Create a detailed error message
  const message = formattedErrors
    .map(err => `${err.message}${err.details ? ` (${err.details})` : ''}`)
    .join('\n');

  return { 
    message,
    errors: errors 
  };
}

/**
 * Fetch data from the GraphQL API for public queries
 * @param query GraphQL query
 * @param variables Variables for the query
 * @param requestOptions Optional cache configuration for the fetch request
 * @returns Structured response with success/error information
 */
export async function osbClient<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
  requestOptions?: RequestInit
): Promise<OSBResponse<T>> {
  try {
    // Create GraphQL client
    const client = await createGraphQLClient();

    // Make the request
    const data = await client.request<T>(query, variables);

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error("Error fetching GraphQL data:", error);

    if (error instanceof ClientError) {
      const { message, errors } = formatGraphQLErrors(error);
      return {
        success: false,
        error: message,
        errors
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}