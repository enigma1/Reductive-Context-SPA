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
  GetMcpListRequest,
  GetMcpListResponse,
  GetMcpRequest,
  GetMcpResponse,
  GetFlowRequest,
  GetFlowResponse,
  GetFlowListRequest,
  GetFlowListResponse,
  GetLanguagesResponse,
  GetLanguagesRequest,
  GetOpenRouterModelsRequest,
  GetOpenRouterModelsResponse,
} from '>/contracts';
import { apiPoints } from '>/services/api';
import { getCamelKeys, getOnlyColumnsFromResult } from '>/services/utils';
import {
  defaultResponse,
  defaultTableResponse,
  defaultExtTableResponse,
  BUNDLE_ID,
  BUNDLE_PROMPT,
  MCP_NAME,
  MCP_TRANSPORT,
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
    getColumnValues: (colNames: string[]) => JsonArray[];
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
    getColumnValues: (colNames: string[]) => {
      const columnValues = getOnlyColumnsFromResult({
        rows: state.rows as unknown as JsonArray[],
        columnsOrder: getCamelKeys(state.columnsOrder),
        fields: colNames,
      });
      return columnValues;
    },

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
  { getColumnValues: (colNames: string[]) => JsonArray[] }
>({
  queryKey: () => queryKeys.roleList(),
  queryFn: async () => {
    const rsp = await apiPoints.getRoleList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultExtTableResponse,
  }),
  createApi: (state) => ({
    getColumnValues: (colNames: string[]) => {
      const columnValues = getOnlyColumnsFromResult({
        rows: state.rows as unknown as JsonArray[],
        columnsOrder: getCamelKeys(state.columnsOrder),
        fields: colNames,
      });
      return columnValues;
    },
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
    sortOrder: 0,
    status: 0,
  }),
  enabled: (req) => !!req.name,
});

export const useGetMcpList = createDataQueryHook<
  GetMcpListResponse,
  GetMcpListRequest,
  { getColumnValues: (colNames: string[]) => JsonArray[] }
>({
  queryKey: () => queryKeys.mcpList(),
  queryFn: async () => {
    const rsp = await apiPoints.getMcpList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultExtTableResponse,
  }),
  createApi: (state) => ({
    getColumnValues: (colNames: string[]) => {
      const columnValues = getOnlyColumnsFromResult({
        rows: state.rows as unknown as JsonArray[],
        columnsOrder: getCamelKeys(state.columnsOrder),
        fields: colNames,
      });
      return columnValues;
    },
  }),
});

export const useGetMcp = createDataQueryHook<GetMcpResponse, GetMcpRequest, {}>(
  {
    queryKey: (req) => queryKeys.mcps(req),
    queryFn: async (req) => {
      const rsp = await apiPoints.getMcp(req);
      return rsp;
    },
    initialData: (req) => ({
      ...defaultResponse,
      mcpName: req.name,
      mcpJson: '',
      mcpSummary: '',
      mcpTransport: 'internal',
      status: 0,
      sortOrder: 0,
    }),
    enabled: (req) => !!req.name,
  },
);

export const useGetFlowList = createDataQueryHook<
  GetFlowListResponse,
  GetFlowListRequest,
  { getColumnValues: (colNames: string[]) => JsonArray[] }
>({
  queryKey: () => queryKeys.flowList(),
  queryFn: async () => {
    const rsp = await apiPoints.getFlowList();
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    ...defaultExtTableResponse,
  }),
  createApi: (state) => ({
    getColumnValues: (colNames: string[]) => {
      const columnValues = getOnlyColumnsFromResult({
        rows: state.rows as unknown as JsonArray[],
        columnsOrder: getCamelKeys(state.columnsOrder),
        fields: colNames,
      });
      return columnValues;
    },
  }),
});

export const useGetFlow = createDataQueryHook<
  GetFlowResponse,
  GetFlowRequest,
  {}
>({
  queryKey: (req) => queryKeys.flows(req),
  queryFn: async (req) => {
    const rsp = await apiPoints.getFlow(req);
    return rsp;
  },
  initialData: () => ({
    ...defaultResponse,
    flowName: '',
    nodes: [],
    edges: [],
    status: 0,
    sortOrder: 0,
  }),
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
