import type { MutationFunction } from '@tanstack/react-query';
import { apiPoints } from '>/services/api';
import { defaultResponse } from '>/config';
import type {
  CreateBundleRequest,
  CreateBundleResponse,
  SetBundleRequest,
  SetBundleResponse,
  SubmitBundleRequest,
  DeleteBundlesRequest,
  DeleteBundlesResponse,
} from '>/contracts';
import { createMutationHook } from './mutationBuilder';
import { queryKeys } from './defs';

const defaultCreateBundle = {
  totalTokens: 0,
  bundleId: 0,
};

export const useCreateBundle = createMutationHook<
  MutationFunction<CreateBundleResponse, CreateBundleRequest>
>({
  fn: apiPoints.createBundle,
  state: {
    ...defaultResponse,
    ...defaultCreateBundle,
  },
  options: {
    cache: async (qc, data) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getBundle({ bundleId: data.bundleId }),
      });
    },
  },
});

const defaultSetBundle = {
  totalTokens: 0,
  bundleId: 0,
};

export const useSetBundle = createMutationHook<
  MutationFunction<SetBundleResponse, SetBundleRequest>
>({
  fn: apiPoints.setBundle,
  state: {
    ...defaultResponse,
    ...defaultSetBundle,
  },
});

export const useSubmitBundle = createMutationHook<
  MutationFunction<unknown, SubmitBundleRequest>
>({
  fn: apiPoints.submitBundle,
  state: {
    ...defaultResponse,
  },
});

export const useDeleteBundles = createMutationHook<
  MutationFunction<DeleteBundlesResponse, DeleteBundlesRequest>
>({
  fn: apiPoints.deleteBundles,
  state: {
    ...defaultResponse,
  },
  options: {
    cache: async (qc) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getBundleList(),
      });
    },
  },
});
