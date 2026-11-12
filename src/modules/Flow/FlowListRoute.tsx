import { useGetFlowList } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';
import { useConfigStore } from '>/services/stores';
import { FlowCardView } from './FlowCardView';
import { FlowTableView } from './FlowTableView';

export const FlowListRoute = () => {
  const { listMode } = useConfigStore(({ state }) => ({
    listMode: state.listMode,
  }));

  const { rows, cols, columnsOrder, getColumnValues, isFetching, refetch } =
    useGetFlowList(undefined, ({ state, query, api }) => ({
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
    <FlowCardView getColumnValues={getColumnValues} {...headerActions} />
  ) : (
    <FlowTableView
      {...headerActions}
      rows={rows}
      cols={cols}
      columnsOrder={columnsOrder}
      onRefetch={refetch}
    />
  );
};
