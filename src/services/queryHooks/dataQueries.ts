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
  GetRoleListRequest,
  GetRoleListResponse,
  GetRoleRequest,
  GetRoleResponse,
  GetLanguagesResponse,
  GetLanguagesRequest,
  GetOpenRouterModelsRequest,
  GetOpenRouterModelsResponse,
} from '>/contracts';
import { apiPoints } from '>/services/api';
import { getOnlyColumnsFromResult } from '>/services/utils';
import {
  defaultResponse,
  defaultTableResponse,
  defaultExtTableResponse,
  BUNDLE_ID,
  BUNDLE_PROMPT,
} from '>/config';
import type { JsonArray } from '>/types';
import { createDataQueryHook } from './dataQueryBuilder';
import { queryKeys } from './defs';

export const useGetTableData = createDataQueryHook<
  GetTableDataResponse,
  GetTableDataRequest,
  {}
>({
  queryKey: (req) => queryKeys.tableData(req.table ?? ''),
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
  queryKey: (req) => queryKeys.paths(req),
  queryFn: async (req) => {
    const response = await apiPoints.getPaths({
      paths: req.paths,
    });
    return response;
  },
  initialData: () => ({
    ...defaultResponse,
    paths: {},
    textTrees: {},
    unresolved: [],
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
  queryKey: (fileNode) => queryKeys.files(fileNode!),
  queryFn: async (fileNode) => {
    const response = await apiPoints.readFile(fileNode!);
    return response;
  },
  initialData: () => ({
    ...defaultResponse,
    content: '',
  }),
  enabled: (fileNode) => !!fileNode,
});

export const useGetBundle = createDataQueryHook<
  GetBundleResponse,
  GetBundleRequest,
  {}
>({
  queryKey: (req) => queryKeys.bundles(req),
  queryFn: async (req) => {
    const rsp = await apiPoints.getBundle(req);
    return rsp;
  },
  initialData: (req) => ({
    ...defaultResponse,
    bundleContent: '',
    prompt: '',
    rootPaths: [],
    textTrees: {},
    userFiles: [],
    conversations: [],
    bundleId: req.bundleId,
    inputTokens: 0,
    outputTokens: 0,
  }),
  enabled: (req) => !!req.bundleId,
});

type EntryFields = {
  bundleId: number;
  prompt: string;
};

export const useGetBundleList = createDataQueryHook<
  GetBundleListResponse,
  GetBundleListRequest,
  {
    getBundleNames: () => string[];
    getBundleFields: () => EntryFields[];
  }
>({
  queryKey: () => queryKeys.bundleList(),
  queryFn: async () => {
    const rsp = await apiPoints.getBundleList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultExtTableResponse,
  }),
  createApi: (state) => ({
    getBundleFields: () => {
      const fields = [BUNDLE_ID, BUNDLE_PROMPT];
      return getOnlyColumnsFromResult({
        rows: state.rows as JsonArray[],
        columnsOrder: state.columnsOrder,
        fields,
      }).map(([bundleId, prompt]) => ({
        bundleId: Number(bundleId),
        prompt: String(prompt ?? ''),
      }));
    },

    getBundleNames: () => {
      const fields = [BUNDLE_ID, BUNDLE_PROMPT];
      const names = getOnlyColumnsFromResult({
        rows: state.rows as JsonArray[],
        columnsOrder: state.columnsOrder,
        fields,
      }).map(([id, prompt]) => {
        const text = String(prompt ?? '')
          .split('\n')
          .filter((line) => !line.trimStart().startsWith('#'))
          .join(' ')
          .trim();
        return `${id}-${text}`;
      });
      return names;
    },
  }),
});

export const useGetRoleList = createDataQueryHook<
  GetRoleListResponse,
  GetRoleListRequest,
  {}
>({
  queryKey: () => queryKeys.roleList(),
  queryFn: async () => {
    const rsp = await apiPoints.getRoleList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    roles: [],
  }),
});

export const useGetRole = createDataQueryHook<
  GetRoleResponse,
  GetRoleRequest,
  {}
>({
  queryKey: (req) => queryKeys.roles(req),
  queryFn: async (req) => {
    const rsp = await apiPoints.getRole(req);
    return rsp;
  },
  initialData: (req) => ({
    ...defaultResponse,
    name: '',
    roleMain: '',
    contentRules: '',
    contentExamples: '',
    scopePrompt: '',
    scopeRules: '',
    scopeExamples: '',
  }),
  enabled: (req) => !!req.name,
});

export const useGetLanguages = createDataQueryHook<
  GetLanguagesResponse,
  GetLanguagesRequest,
  {}
>({
  queryKey: () => queryKeys.languages(),
  queryFn: async () => {
    const rsp = await apiPoints.getLanguages();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    languages: {},
  }),
});

export const useOpenRouterModels = createDataQueryHook<
  GetOpenRouterModelsResponse,
  GetOpenRouterModelsRequest,
  {}
>({
  queryKey: () => queryKeys.models(),
  queryFn: async () => {
    const rsp = await apiPoints.getOpenRouterModels();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    models: [],
  }),
});
