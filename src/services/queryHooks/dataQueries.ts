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
} from '>/contracts';
import { apiPoints } from '>/services/api';
import { defaultResponse, defaultListResponse } from '>/config';
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
    ...defaultListResponse,
  }),
  enabled: (req) => !!req.table,
});

export const useGetPaths = createDataQueryHook<
  GetPathsResponse,
  GetPathsRequest,
  {}
>({
  queryKey: (req) => queryKeys.getPaths(req).map((e) => String(e)),
  queryFn: async (req) => {
    const response = await apiPoints.getPaths({
      paths: req.paths,
    });
    return response;
  },
  initialData: (req) => ({
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
    totalTokens: 0,
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
  initialData: (req) => ({
    ...defaultResponse,
    bundles: [],
  }),
  enabled: () => true,
});

// // Call site — same signature as before
// const { state, query } = useTableColumnsInfoHook(
//   { database, table },
//   // optional selector
// );
