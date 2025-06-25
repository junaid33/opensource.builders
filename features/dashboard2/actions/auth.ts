"use server";

import { keystoneClient } from "@/features/dashboard2/lib/keystoneClient";

export async function getAuthenticatedUser() {
  try {
    const query = `
      query GetAuthenticatedUser {
        authenticatedItem {
          ... on User {
            id
            name
            email
          }
        }
      }
    `;

    const response = await keystoneClient(query);

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Failed to fetch authenticated user"
      };
    }

    return {
      success: true,
      data: {
        authenticatedItem: response.data?.authenticatedItem || null
      }
    };
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}