import { useGetMcpList } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';
import { useConfigStore } from '>/services/stores';
import { McpCardView } from './McpCardView';
import { McpTableView } from './McpTableView';

export const McpListRoute = () => {
  const { listMode } = useConfigStore(({ state }) => ({
    listMode: state.listMode,
  }));

  const { rows, cols, columnsOrder, getColumnValues, isFetching, refetch } =
    useGetMcpList(undefined, ({ state, query, api }) => ({
      getColumnValues: api.getColumnValues,
      rows: state.rows,
      cols: state.cols,
      columnsOrder: state.columnsOrder,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }));

  const isBusy = isFetching;
  if (isBusy) return <ScreenLoader />;

  const headerActions = {
    onRefetch: () => {
      refetch();
    },
    onConfirmDelete: () => {},
  };

  return listMode === 'card' ? (
    <McpCardView getColumnValues={getColumnValues} {...headerActions} />
  ) : (
    <McpTableView
      {...headerActions}
      rows={rows}
      cols={cols}
      columnsOrder={columnsOrder}
      onRefetch={refetch}
    />
  );
};
