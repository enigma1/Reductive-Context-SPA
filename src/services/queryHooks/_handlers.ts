import pickBy from 'lodash-es/pickBy';
import { UseMutationResult } from '@tanstack/react-query';
import { appStoreActions } from '>/services/stores';
import { createNetworkError } from '>/services/api/apiErrors';
import { MutationQuery } from './defs';

export const getMutationResult = <TData = any, TVariables = any>(
  mutation: UseMutationResult<TData, any, TVariables>,
) => {
  const guardMutate: typeof mutation.mutate = (...args) => {
    if (!appStoreActions.getAppStatus()) {
      // const error = createNetworkError('offline');
      // options?.onError?.(error, variables, undefined, mutation.context);
      console.log('Mutation attempt while offline = exiting');
      return;
    }

    mutation.mutate(...args);
  };

  const guardMutateAsync: typeof mutation.mutateAsync = async (...args) => {
    if (!appStoreActions.getAppStatus()) {
      throw createNetworkError('offline');
    }

    return mutation.mutateAsync(...args);
  };

  const api = pickBy(mutation, (val) => typeof val === 'function') as {
    mutate: typeof mutation.mutate;
    mutateAsync: typeof mutation.mutateAsync;
  };

  const query = pickBy(
    mutation,
    (val) => typeof val !== 'function',
  ) as MutationQuery<TData>;
  return {
    api: {
      ...api,
      mutate: guardMutate,
      mutateAsync: guardMutateAsync,
    },
    query,
  };
};
