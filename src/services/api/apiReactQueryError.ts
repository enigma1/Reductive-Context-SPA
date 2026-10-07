import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { handleApiError } from './apiErrorsDialog';
import { ApiError } from '>/types';

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
