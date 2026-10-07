/* File: src/bootstrap/queryClient.ts
  handles errors for data queries and mutations
*/
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '>/types';
import { handleApiError } from '>/modules';

export const queryClientHandlers = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      handleApiError(error as ApiError, 'query');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      handleApiError(error as ApiError, 'mutation');
    },
  }),
});
