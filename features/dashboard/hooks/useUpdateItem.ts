'use client';

import { useState } from 'react';
import { updateItemAction } from '@/app/actions/admin';
import type { KeystoneResponse } from '@/features/dashboard/lib/keystoneClient'; // Correct import path for KeystoneResponse

interface UpdateItemHookResult {
  // Update the return type to Promise<KeystoneResponse<any>>
  updateItem: (id: string, data: Record<string, any>) => Promise<KeystoneResponse<any>>;
  isLoading: boolean;
  error: Error | null; // Keep this for potential pre-action errors or state update issues
}

export function useUpdateItem(listKey: string): UpdateItemHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Update the function signature to match the interface
  const updateItem = async (id: string, data: Record<string, any>): Promise<KeystoneResponse<any>> => {
    setIsLoading(true);
    setError(null); // Reset error before attempting
    try {
      // Call the action and return its response directly
      const response = await updateItemAction(listKey, id, data);
      return response;
    } catch (err) {
      // Catch unexpected errors during the action call itself (e.g., network issues)
      console.error("Unexpected error in useUpdateItem:", err);
      setError(err as Error);
      // Return a generic error response matching KeystoneResponse structure
      return { success: false, error: (err as Error).message || 'An unexpected error occurred during the update action.' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateItem,
    isLoading,
    error,
  };
} 