import type { MutationFunction } from '@tanstack/react-query';
import { createMutationHook } from './mutationBuilder';
import { apiPoints } from '>/services/api';
import { defaultResponse } from '>/config';
import type {
  BundleDataRequest,
  BundleDataResponse,
  SetBundleRequest,
  SetBundleResponse,
} from '>/contracts';

const defaultBundleData = {
  totalTokens: 0,
  bundleId: 0,
};

export const useBundleData = createMutationHook<
  MutationFunction<BundleDataResponse, BundleDataRequest>
>({
  fn: apiPoints.bundleData,
  state: {
    ...defaultResponse,
    ...defaultBundleData,
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
