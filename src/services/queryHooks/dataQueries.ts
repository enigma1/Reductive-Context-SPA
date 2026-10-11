/* File: src/services/queryHooks/dataQueries.ts
  Data query hooks use a selector interface
  First argument is a request object or undefined
  Second argument is the selector function
*/
import type {
  GetPathsRequest,
  GetPathsResponse,
  GetTableDataRequest,
  GetTableDataResponse,
  ReadFileRequest,
  ReadFileResponse,
  GetBundleRequest,
  GetBundleResponse,
  GetBundleListRequest,
  GetBundleListResponse,
  GetLanguagesResponse,
  GetLanguagesRequest,
} from '>/contracts';
import { apiPoints } from '>/services/api';
import {
  defaultResponse,
  defaultTableResponse,
  defaultExtTableResponse,
} from '>/config';
import { createDataQueryHook } from './dataQueryBuilder';
import { queryKeys } from './defs';

export const useGetTableData = createDataQueryHook<
  GetTableDataResponse,
  GetTableDataRequest,
  {}
>({
  queryKey: (req) => queryKeys.getTableData(req.table ?? ''),
  queryFn: async (req) => {
    return await apiPoints.getTableData({
      table: req.table,
    });
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultTableResponse,
  }),
  enabled: (req) => !!req.table,
});

export const useGetPaths = createDataQueryHook<
  GetPathsResponse,
  GetPathsRequest,
  {}
>({
  queryKey: (req) => queryKeys.getPaths(req),
  queryFn: async (req) => {
    const response = await apiPoints.getPaths({
      paths: req.paths,
    });
    return response;
  },
  initialData: () => ({
    ...defaultResponse,
    paths: {},
  }),
  staleTime: 30_000,
  enabled: (req) => {
    const firstPath = req.paths[0];
    return firstPath !== undefined && firstPath.path.length > 0;
  },
});

export const useReadFile = createDataQueryHook<
  ReadFileResponse,
  ReadFileRequest | undefined,
  {}
>({
  queryKey: (fileNode) => queryKeys.readFile(fileNode!),
  queryFn: async (fileNode) => {
    const response = await apiPoints.readFile(fileNode!);
    return response;
  },
  initialData: () => ({
    ...defaultResponse,
    code: '',
  }),
  enabled: (fileNode) => !!fileNode,
});

export const useGetBundle = createDataQueryHook<
  GetBundleResponse,
  GetBundleRequest,
  {}
>({
  queryKey: (req) => queryKeys.getBundle(req),
  queryFn: async (req) => {
    const rsp = await apiPoints.getBundle(req);
    return rsp;
  },
  initialData: (req) => ({
    ...defaultResponse,
    bundleContent: '',
    bundleId: req.bundleId,
    inputTokens: 0,
    outputTokens: 0,
  }),
  enabled: (req) => !!req.bundleId,
});

export const useGetBundleList = createDataQueryHook<
  GetBundleListResponse,
  GetBundleListRequest,
  {}
>({
  queryKey: () => queryKeys.getBundleList(),
  queryFn: async () => {
    const rsp = await apiPoints.getBundleList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultExtTableResponse,
  }),
});

export const useGetLanguages = createDataQueryHook<
  GetLanguagesResponse,
  GetLanguagesRequest,
  {}
>({
  queryKey: () => queryKeys.getLanguages(),
  queryFn: async () => {
    const rsp = await apiPoints.getLanguages();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    languages: {},
  }),
});

// // Call site — same signature as before
// const { state, query } = useTableColumnsInfoHook(
//   { database, table },
//   // optional selector
// );
