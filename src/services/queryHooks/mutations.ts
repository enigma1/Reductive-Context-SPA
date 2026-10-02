import type { MutationFunction } from '@tanstack/react-query';
import { createMutationHook } from './mutationBuilder';
import { apiPoints } from '>/services/api';
import { defaultResponse } from '>/config';
import type {
  CreateBundleRequest,
  CreateBundleResponse,
  SetBundleRequest,
  SetBundleResponse,
  SubmitBundleRequest,
  SubmitBundleResponse,
} from '>/contracts';

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
  MutationFunction<SubmitBundleResponse, SubmitBundleRequest>
>({
  fn: apiPoints.setBundle,
  state: {
    ...defaultResponse,
    ...defaultSetBundle,
  },
});
