import type { MutationFunction } from '@tanstack/react-query';
import { apiPoints } from '>/services/api';
import { defaultResponse } from '>/config';
import type {
  ActivateRoleRequest,
  ActivateRoleResponse,
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
  CreateRoleRequest,
  CreateRoleResponse,
  SetRoleRequest,
  SetRoleResponse,
  DeleteRolesRequest,
  DeleteRolesResponse,
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
    cache: async (qc, rsp, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getBundleList(),
      });
      await Promise.all(
        req.bundleIds.map((id) =>
          qc.invalidateQueries({
            queryKey: queryKeys.getBundle({ bundleId: id }),
          }),
        ),
      );
    },
    cacheError: async (qc, err, req) => {
      await qc.invalidateQueries({ queryKey: queryKeys.getRoleList() });
      await Promise.all(
        req.bundleIds.map((id) =>
          qc.invalidateQueries({
            queryKey: queryKeys.getBundle({ bundleId: id }),
          }),
        ),
      );
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
    cache: async (qc, rsp, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.readFile({ path: req.path, name: req.name }),
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
    cache: async (qc, rsp, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getRole({ name: req.name }),
      });
    },
  },
});

const defaultCreateRole = {};

export const useCreateRole = createMutationHook<
  MutationFunction<CreateRoleResponse, CreateRoleRequest>
>({
  fn: apiPoints.createRole,
  state: {
    ...defaultResponse,
    ...defaultCreateRole,
  },
  options: {
    cache: async (qc) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getRoleList(),
      });
    },
  },
});

export const useDeleteRoles = createMutationHook<
  MutationFunction<DeleteRolesResponse, DeleteRolesRequest>
>({
  fn: apiPoints.deleteRoles,
  state: {
    ...defaultResponse,
  },
  options: {
    cache: async (qc, rsp, req) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.getRoleList(),
      });
      await Promise.all(
        req.roleNames.map((name) =>
          qc.invalidateQueries({
            queryKey: queryKeys.getRole({ name }),
          }),
        ),
      );
    },
    // on error we don't know what actually got deleted so invalidate all associated caches
    cacheError: async (qc, err, req) => {
      await qc.invalidateQueries({ queryKey: queryKeys.getRoleList() });
      await Promise.all(
        req.roleNames.map((name) =>
          qc.invalidateQueries({ queryKey: queryKeys.getRole({ name }) }),
        ),
      );
    },
  },
});

export const useActivateRole = createMutationHook<
  MutationFunction<ActivateRoleResponse, ActivateRoleRequest>
>({
  fn: apiPoints.activateRole,
  state: {
    ...defaultResponse,
  },
});
