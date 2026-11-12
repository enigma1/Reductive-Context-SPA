import { useGetRoleList } from '>/services/queryHooks';
import { useConfigStore } from '>/services/stores';
import { ScreenLoader } from '>/modules';
import { RoleCardView } from './RoleCardView';
import { RoleTableView } from './RoleTableView';

export const RoleListRoute = () => {
  const { listMode } = useConfigStore(({ state }) => ({
    listMode: state.listMode,
  }));

  const { rows, cols, columnsOrder, getColumnValues, isFetching, refetch } =
    useGetRoleList(undefined, ({ state, query, api }) => ({
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
    <RoleCardView getColumnValues={getColumnValues} {...headerActions} />
  ) : (
    <RoleTableView
      {...headerActions}
      rows={rows}
      cols={cols}
      columnsOrder={columnsOrder}
      onRefetch={refetch}
    />
  );
};
