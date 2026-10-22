/* File src/services/api/apiPoints.ts
  API to connect to the back end
*/
import type { AxiosResponse } from 'axios';
import { routes } from '>/config';
import {
  GetTableDataContract,
  GetPathsContract,
  ReadFileContract,
  WriteFileContract,
  CreateBundleContract,
  GetBundleContract,
  SetBundleContract,
  GetBundleListContract,
  GetRoleListContract,
  GetRoleContract,
  SetRoleContract,
  DeleteRolesContract,
  DeleteBundlesContract,
  GetLanguagesContract,
  GetOpenRouterModelsContract,
} from '>/contracts';
import type {
  BasicResponse,
  GetTableDataRequest,
  GetTableDataResponse,
  GetPathsRequest,
  GetPathsResponse,
  ReadFileRequest,
  ReadFileResponse,
  WriteFileRequest,
  WriteFileResponse,
  CreateBundleRequest,
  CreateBundleResponse,
  GetBundleRequest,
  GetBundleResponse,
  SetBundleRequest,
  SetBundleResponse,
  SubmitBundleRequest,
  ResumeBundleRequest,
  GetBundleListResponse,
  GetRoleListResponse,
  GetRoleRequest,
  GetRoleResponse,
  SetRoleRequest,
  SetRoleResponse,
  DeleteRolesRequest,
  DeleteRolesResponse,
  DeleteBundlesRequest,
  DeleteBundlesResponse,
  GetLanguagesResponse,
  GetOpenRouterModelsResponse,
} from '>/contracts';
import { defaultResponseOk } from '>/config';

import { bundlePostResponse, streamPost } from './sse';
import { apiErrorResolver } from './apiErrors';
import { apiClient } from './client';
import type {
  AbortResponse,
  DelayedRequest,
  DelayedResponse,
  LoadSettingsResponse,
  SaveSettingsRequest,
} from './apiPointsTypes';

type ApiOptions = {
  signal?: AbortSignal;
};

const constructClientUrl = (relative: string) =>
  `${(apiClient.defaults.baseURL ?? '').replace(/\/$/, '')}/${relative.replace(/^\//, '')}`;

// For axios
export const handleApiAxios = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    const result = await fn();
    return result;
  } catch (e: unknown) {
    await apiErrorResolver(e);
  }
  throw new Error('unknown');
};

const apiCall = <T>(fn: () => Promise<AxiosResponse<T>>): Promise<T> =>
  handleApiAxios(async () => {
    const res = await fn();
    return res.data;
  });

const apiCallRaw = <T = void>(fn: () => Promise<T>) =>
  handleApiAxios<T>(async () => {
    return await fn();
  });

const abort = () =>
  apiCall<AbortResponse>(() => apiClient.get(routes.back.abort));
// const checkSession = () =>
//   apiCall<BasicResponse>(() => apiClient.get(routes.back.checkSession));
const checkSession = () => defaultResponseOk;
const delayed = (data: DelayedRequest, { signal }: ApiOptions) =>
  apiCall<DelayedResponse>(() =>
    apiClient.post(routes.back.delayed, data, { timeout: 300_000, signal }),
  );

const getPaths = (data: GetPathsRequest) =>
  apiCall<GetPathsResponse>(() =>
    apiClient.post(routes.back.getPaths, data, GetPathsContract),
  );

const readFile = (data: ReadFileRequest) =>
  apiCall<ReadFileResponse>(() =>
    apiClient.post(routes.back.readFile, data, ReadFileContract),
  );
const writeFile = (data: WriteFileRequest) =>
  apiCall<WriteFileResponse>(() =>
    apiClient.post(routes.back.writeFile, data, WriteFileContract),
  );

const createBundle = (data: CreateBundleRequest) =>
  apiCall<CreateBundleResponse>(() =>
    apiClient.post(routes.back.createBundle, data, CreateBundleContract),
  );
const getBundle = (data: GetBundleRequest) =>
  apiCall<GetBundleResponse>(() =>
    apiClient.post(routes.back.getBundle, data, GetBundleContract),
  );
const setBundle = (data: SetBundleRequest) =>
  apiCall<SetBundleResponse>(() =>
    apiClient.post(routes.back.setBundle, data, SetBundleContract),
  );
const submitBundle = (data: SubmitBundleRequest) =>
  apiCallRaw<void>(() =>
    streamPost<SubmitBundleRequest>(
      constructClientUrl(routes.back.submitBundle),
      data,
      bundlePostResponse,
    ),
  );

const resumeBundle = (data: ResumeBundleRequest) =>
  apiCallRaw<void>(() =>
    streamPost<ResumeBundleRequest>(
      constructClientUrl(routes.back.resumeBundle),
      data,
      bundlePostResponse,
    ),
  );

const getBundleList = () =>
  apiCall<GetBundleListResponse>(() =>
    apiClient.get(routes.back.getBundleList, GetBundleListContract),
  );
const deleteBundles = (data: DeleteBundlesRequest) =>
  apiCall<DeleteBundlesResponse>(() =>
    apiClient.post(routes.back.deleteBundles, data, DeleteBundlesContract),
  );

const getRoleList = () =>
  apiCall<GetRoleListResponse>(() =>
    apiClient.get(routes.back.getRoleList, GetRoleListContract),
  );
const getRole = (data: GetRoleRequest) =>
  apiCall<GetRoleResponse>(() =>
    apiClient.post(routes.back.getRole, data, GetRoleContract),
  );
const setRole = (data: SetRoleRequest) =>
  apiCall<SetRoleResponse>(() =>
    apiClient.post(routes.back.setRole, data, SetRoleContract),
  );
const deleteRoles = (data: DeleteRolesRequest) =>
  apiCall<DeleteRolesResponse>(() =>
    apiClient.post(routes.back.deleteRoles, data, DeleteRolesContract),
  );

const getTableData = (data: GetTableDataRequest) =>
  apiCall<GetTableDataResponse>(() =>
    apiClient.post(routes.back.getTableData, data, GetTableDataContract),
  );

const getLanguages = () =>
  apiCall<GetLanguagesResponse>(() =>
    apiClient.get(routes.back.getLanguages, GetLanguagesContract),
  );

const getOpenRouterModels = () =>
  apiCall<GetOpenRouterModelsResponse>(() =>
    apiClient.get(routes.back.getOpenRouterModels, GetOpenRouterModelsContract),
  );

const saveSettings = (data: SaveSettingsRequest) =>
  apiCall<BasicResponse>(() => apiClient.post(routes.back.saveSettings, data));
const loadSettings = () =>
  apiCall<LoadSettingsResponse>(() => apiClient.get(routes.back.loadSettings));

export const apiPoints = {
  checkSession,
  abort,
  delayed,
  getPaths,
  readFile,
  writeFile,
  getBundleList,
  createBundle,
  getBundle,
  setBundle,
  submitBundle,
  resumeBundle,
  deleteBundles,
  getRoleList,
  getRole,
  setRole,
  deleteRoles,
  getTableData,
  getLanguages,
  getOpenRouterModels,
  saveSettings,
  loadSettings,
} as const;
