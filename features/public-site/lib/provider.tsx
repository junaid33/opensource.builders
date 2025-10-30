'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

type PublicSiteProviderProps = {
  children: React.ReactNode;
};

export const PublicSiteProvider = ({ children }: PublicSiteProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute - prevent immediate refetching on client
            gcTime: 10 * 60 * 1000, // 10 minutes 
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};