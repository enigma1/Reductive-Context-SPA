import type { AxiosResponse } from 'axios';
import { apiErrorResolver } from './apiErrors';
import { apiClient } from './client';
import { routes } from '>/config';

import {
  GetTableDataSchema,
  GetPathsContract,
  BundleDataContract,
  GetBundleContract,
} from '>/contracts';
import type {
  BasicResponse,
  GetTableDataRequest,
  GetTableDataResponse,
  GetPathsRequest,
  GetPathsResponse,
  ReadFileRequest,
  ReadFileResponse,
  BundleDataRequest,
  BundleDataResponse,
  GetBundleRequest,
  GetBundleResponse,
} from '>/contracts';

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

const abort = () =>
  apiCall<AbortResponse>(() => apiClient.get(routes.back.abort));
const ping = () =>
  apiCall<BasicResponse>(() => apiClient.get(routes.back.ping));
const checkSession = () =>
  apiCall<BasicResponse>(() => apiClient.get(routes.back.checkSession));
const delayed = (data: DelayedRequest, { signal }: ApiOptions) =>
  apiCall<DelayedResponse>(() =>
    apiClient.post(routes.back.delayed, data, { timeout: 300_000, signal }),
  );

const getPaths = (data: GetPathsRequest) =>
  apiCall<GetPathsResponse>(() =>
    apiClient.post(routes.back.getPaths, data, GetPathsContract),
  );

const readFile = (data: ReadFileRequest) =>
  apiCall<ReadFileResponse>(() => apiClient.post(routes.back.readFile, data));

const bundleData = (data: BundleDataRequest) =>
  apiCall<BundleDataResponse>(() =>
    apiClient.post(routes.back.bundleData, data, BundleDataContract),
  );

const getBundle = (data: GetBundleRequest) =>
  apiCall<GetBundleResponse>(() =>
    apiClient.post(routes.back.getBundle, data, GetBundleContract),
  );

const getTableData = (data: GetTableDataRequest) =>
  apiCall<GetTableDataResponse>(() =>
    apiClient.post(routes.back.getTableData, data, GetTableDataSchema),
  );

const saveSettings = (data: SaveSettingsRequest) =>
  apiCall<BasicResponse>(() => apiClient.post(routes.back.saveSettings, data));
const loadSettings = () =>
  apiCall<LoadSettingsResponse>(() => apiClient.get(routes.back.loadSettings));

export const apiPoints = {
  ping,
  checkSession,
  abort,
  delayed,
  getPaths,
  readFile,
  bundleData,
  getBundle,
  getTableData,
  saveSettings,
  loadSettings,
} as const;
