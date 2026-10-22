import type { MutationFunction } from '@tanstack/react-query';
import { apiPoints } from '>/services/api';
import { defaultResponse } from '>/config';
import type {
  CreateBundleRequest,
  CreateBundleResponse,
  SetBundleRequest,
  SetBundleResponse,
  SubmitBundleRequest,
  ResumeBundleRequest,
  DeleteBundlesRequest,
  DeleteBundlesResponse,
  WriteFileRequest,
  WriteFileResponse,
  SetRoleRequest,
  SetRoleResponse,
} from '>/contracts';
import { createMutationHook } from './mutationBuilder';
import { queryKeys } from './defs';

const defaultCreateBundle = {
  inputTokens: 0,
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
    cache: async (qc) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getBundleList(),
      });
    },
  },
});

const defaultSetBundle = {
  outputTokens: 0,
  inputTokens: 0,
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
  options: {
    cache: async (qc, data, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getBundle({ bundleId: req.bundleId }),
      });
    },
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

export const useResumeBundle = createMutationHook<
  MutationFunction<unknown, ResumeBundleRequest>
>({
  fn: apiPoints.resumeBundle,
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
      // await qc.invalidateQueries({
      //   queryKey: queryKeys.getBundle(),
      // });
    },
  },
});

export const useWriteFile = createMutationHook<
  MutationFunction<WriteFileResponse, WriteFileRequest>
>({
  fn: apiPoints.writeFile,
  state: {
    ...defaultResponse,
  },
  options: {
    cache: async (qc, _, params) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.readFile({ path: params.path, name: params.name }),
      });
    },
  },
});

const defaultSetRole = {};

export const useSetRole = createMutationHook<
  MutationFunction<SetRoleResponse, SetRoleRequest>
>({
  fn: apiPoints.setRole,
  state: {
    ...defaultResponse,
    ...defaultSetRole,
  },
  options: {
    cache: async (qc, data, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getRole({ name: req.name }),
      });
    },
  },
});
