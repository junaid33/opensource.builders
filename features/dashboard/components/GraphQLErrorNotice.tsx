import React from 'react';
import type { GraphQLError } from 'graphql';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GraphQLErrorNoticeProps {
  networkError?: Error;
  errors?: readonly GraphQLError[];
}

export function GraphQLErrorNotice({ networkError, errors }: GraphQLErrorNoticeProps) {
  if (!networkError && (!errors || errors.length === 0)) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {networkError ? (
          <div>
            <strong>Network Error:</strong> {networkError.message}
          </div>
        ) : errors ? (
          <div>
            {errors.map((error, i) => (
              <div key={i}>
                <strong>GraphQL Error:</strong> {error.message}
                {error.path ? (
                  <div className="text-sm text-gray-500">
                    Path: {error.path.join(' > ')}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </AlertDescription>
    </Alert>
  );
} 