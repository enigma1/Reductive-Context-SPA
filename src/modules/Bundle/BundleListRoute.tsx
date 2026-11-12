import { useMemo } from 'react';
import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';
import {
  createContextTableStore,
  codeStoreActions,
  useConfigStore,
  messageStoreActions,
} from '>/services/stores';
import { ScreenLoader } from '>/modules';
import { DeleteBundlesResponse } from '>/contracts';
import { BundleTableView } from './BundleTableView';
import { BundleCardView } from './BundleCardView.';

export const BundleListRoute = () => {
  const { listMode } = useConfigStore(({ state }) => ({
    listMode: state.listMode,
  }));

  const { tableStore } = useMemo(() => {
    const store = createContextTableStore();
    return {
      tableStore: store,
    };
  }, []);

  const { rows, cols, columnsOrder, isFetching, refetch, getColumnValues } =
    useGetBundleList(undefined, ({ state, query, api }) => ({
      rows: state.rows,
      cols: state.cols,
      columnsOrder: state.columnsOrder,
      isFetching: query.isFetching,
      refetch: query.refetch,
      getColumnValues: api.getColumnValues,
    }));

  const deleteCallbacks = {
    onSuccess: (data: DeleteBundlesResponse) => {
      tableStore.api.clearSelected();
      codeStoreActions.setBundleSession();
      codeStoreActions.setActiveFile();
      codeStoreActions.setActiveBundleId();
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `Bundles Delete Operation Failed.`,
          duration: 8000,
        },
      });
    },
  };

  const { isPending, mutate } = useDeleteBundles(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
    deleteCallbacks,
  );

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isPending;
  if (isBusy) return <ScreenLoader />;

  const headerActions = {
    onRefetch: () => {
      refetch();
    },
    onConfirmDelete: (bundleIds: { bundleIds: number[] }) => {
      mutate(bundleIds);
    },
  };

  return listMode === 'card' ? (
    <BundleCardView getColumnValues={getColumnValues} {...headerActions} />
  ) : (
    <BundleTableView
      {...headerActions}
      rows={rows}
      cols={cols}
      columnsOrder={columnsOrder}
      tableStore={tableStore}
    />
  );
};
