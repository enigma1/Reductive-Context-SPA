import { RefObject } from 'react';
import {
  useQuery,
  UseMutationResult,
  UseMutateFunction,
  UseMutateAsyncFunction,
  MutationOptions,
  MutationFunction,
  QueryClient,
} from '@tanstack/react-query';
import {
  GetPathsRequest,
  ReadFileRequest,
  GetBundleRequest,
  GetRoleRequest,
} from '>/contracts';

export const STALE_TIME = 3 * 60 * 1000; // Set default to 3 minutes
export const KEEP_IN_CACHE_TIME = 8 * 60 * 1000; // Set default to 10 minutes

export type QueryKey = (string | null | object)[];
export type QueryKeyFn = (...args: (string | null | object)[]) => QueryKey;

export type MutationRequestMeta = {
  ctrl?: RefObject<AbortController | null>;
  timeout?: number;
  onSuccess?: (data?: any) => void;
};

export type InferData<T> = T extends MutationFunction<infer R, any> ? R : never;
export type InferVariables<T> =
  T extends MutationFunction<any, infer V> ? V : never;

export type MutationCacheEffect<
  TMutationFn extends MutationFunction<any, any>,
> = {
  cache?: (
    queryClient: QueryClient,
    data: InferData<TMutationFn>,
    variables: InferVariables<TMutationFn>,
  ) => void | Promise<void>;
  cacheError?: (
    queryClient: QueryClient,
    error: Error,
    variables: InferVariables<TMutationFn>,
  ) => void | Promise<void>;
};

export type QueryHookOptions<TData, TVariables, TApi extends object = {}> = {
  queryKey: (variables: TVariables) => string[];
  queryFn: (variables: TVariables) => Promise<TData>;
  initialData: TData;
  enabled?: (variables: TVariables) => boolean;
  createApi?: (data: TData) => TApi;
};

export type MutationApi<TData = any, TVariables = any> = {
  mutate: UseMutateFunction<TData, unknown, TVariables>;
  mutateAsync: UseMutateAsyncFunction<TData, unknown, TVariables>;
};

export type MutationQuery<TData = any> = Omit<
  UseMutationResult<TData, unknown, any>,
  'mutate' | 'mutateAsync'
>;

export type MutationHookProps<TData, TVariables> = {
  api: MutationApi<TData, TVariables>;
  query: MutationQuery<TData>;
  state: TData;
};

export type MutationCallbacks<
  TData,
  TVariables,
  TError = unknown,
  TContext = unknown,
> = Partial<MutationOptions<TData, TError, TVariables, TContext>>;

export type DataQueryHookProps<
  TState,
  TApi = Record<string, (...args: any[]) => any>,
> = {
  api?: TApi;
  state: TState;
  query: ReturnType<typeof useQuery>;
};

export type HookStore<
  TState = unknown,
  TApi = Record<string, (...args: any[]) => any>,
  TQuery = unknown,
> = {
  state: TState;
  api: TApi;
  query: TQuery;
};
export type HookSelector<TStore, TResult = TStore> = (store: TStore) => TResult;

export const queryKeys = {
  // Keys for independent invalidations
  preferences: () => ['preferences'] as const,
  session: () => ['session'],
  getTableData: (table: string) => ['get-table-data', table],
  getPaths: (paths: GetPathsRequest) => ['get-paths', { ...paths }],
  readFile: (req: ReadFileRequest) => ['read-file', { ...req }],
  getBundle: (req: GetBundleRequest) => ['get-bundle', { ...req }],
  getRole: (req: GetRoleRequest) => ['get-role', { ...req }],
  getBundleList: () => ['get-bundles'],
  getRoleList: () => ['get-roles'],
  getLanguages: () => ['get-languages'],
  getOpenRouterModels: () => ['get-open-router-models'],
};
