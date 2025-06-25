import { cache } from 'react';
import { getAuthenticatedUser as getAuthenticatedUserAction } from '@/features/dashboard/actions';
import type { User } from '@/features/dashboard/components/DashboardUI'; 

export const getAuthenticatedUser = cache(async (): Promise<User | null> => { // Update return type
  return getAuthenticatedUserAction();
}); 