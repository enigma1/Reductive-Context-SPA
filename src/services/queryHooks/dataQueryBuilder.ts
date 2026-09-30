import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  DataQueryHookProps,
  STALE_TIME,
  QueryHookOptions,
  QueryKey,
  QueryKeyFn,
} from './defs';

type DataQueryHookOptions<TData, TVariables, TApi extends object = {}> = {
  queryKey: (variables: TVariables) => QueryKey;
  queryFn: (variables: TVariables) => Promise<TData>;
  initialData?: (variables: TVariables) => TData;
  enabled?: (variables: TVariables) => boolean;
  createApi?: (state: TData) => TApi;
  staleTime?: number;
  retry?: number;
  refetchOnWindowFocus?: boolean;
};

type DataHookArgs<TData, TApi extends object> = {
  state: TData;
  api: TApi;
  query: UseQueryResult<TData, Error>;
};

export const createDataQueryHook =
  <TData, TRequest, TApi extends object = {}>(
    options: DataQueryHookOptions<TData, TRequest, TApi>,
  ) =>
  <TSelected = DataHookArgs<TData, TApi>>(
    variables: TRequest,
    selector?: (args: DataHookArgs<TData, TApi>) => TSelected,
  ) => {
    const q = useQuery<TData, Error>({
      queryKey: options.queryKey(variables),
      queryFn: () => options.queryFn(variables),
      // initialData: options.initialData?.(variables),
      staleTime: options.staleTime ?? STALE_TIME,
      retry: options.retry ?? 1,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      enabled: options.enabled?.(variables) ?? true,
    });

    const state = q.data ?? options.initialData!(variables);
    const api = useMemo(
      () => options.createApi?.(state) ?? ({} as TApi),
      [state],
    );

    const args: DataHookArgs<TData, TApi> = {
      state,
      api,
      query: q,
    };

    return selector ? selector(args) : (args as TSelected);
  };

// usage

// export const useTableColumnsInfoHook = createDataQueryHook<
//   GetTableColumnsInfoResponse,
//   TableBasicsUndefined,
//   {}
// >({
//   queryKey: (req) =>
//     queryKeys.tableColumnsInfo(req.database ?? '', req.table ?? ''),
//   queryFn: async (req) =>
//     dbApi.getTableColumnsInfo({
//       database: req.database!,
//       table: req.table!,
//     }),
//   initialData: (req) => ({
//     ...defaultResponse,
//     ...defaultListResponse,
//     database: req.database ?? '',
//     table: req.table ?? '',
//   }),
//   enabled: (req) => !!req.database && !!req.table,
// });

// // Call site — same signature as before
// const { state, query } = useTableColumnsInfoHook(
//   { database, table },
//   // optional selector
// );
