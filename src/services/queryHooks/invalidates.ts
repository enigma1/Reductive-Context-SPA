import { MutationFunction } from '@tanstack/react-query';
import { MutationCacheEffect, queryKeys } from './defs';

// Common invalidate Options on normal/error mutation response
export const invalidateOptions = <
  TMutationFn extends MutationFunction<any, any>,
>(): MutationCacheEffect<TMutationFn> => ({
  cache: async (qc, data) => {
    await qc.invalidateQueries({
      queryKey: queryKeys.preferences(),
    });
  },
  cacheError: async (qc, error) => {
    await qc.invalidateQueries({
      queryKey: queryKeys.preferences(),
    });
  },
});
