import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';
import {
  createContextTableStore,
  codeStoreActions,
  messageStoreActions,
  dialogStoreActions,
} from '>/services/stores';
import {
  dialogActions,
  ScreenLoader,
  TableContainer,
  PageHeader,
  EffectiveTableWrapper,
  ActionPreview,
} from '>/modules';
import { routes, BUNDLE_ID } from '>/config';
import { getSingleColumnFromResult, intoViewRows } from '>/services/utils';
import { JsonArray } from '>/types';

export const BundleList = () => {
  const navigate = useNavigate();
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const { tableStore } = useMemo(() => {
    const store = createContextTableStore();
    return {
      tableStore: store,
    };
  }, []);

  const { rows, columnsOrder, isFetching, refetch } = useGetBundleList(
    undefined,
    ({ state, query }) => ({
      rows: state.rows,
      columnsOrder: state.columnsOrder,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { isPending, mutate } = useDeleteBundles(({ query, state, api }) => ({
    isPending: query.isPending,
    mutate: api.mutate,
  }));

  const viewRows = useMemo(() => {
    return intoViewRows(rows as JsonArray[]);
  }, [rows]);

  const headerActions = {
    onRefetch: () => {
      refetch();
    },
    onDelete: () => {
      const selectedRows = tableStore.get().selectedRows;
      if (selectedRows.size === 0) {
        return;
      }
      const rows = [...selectedRows.values()].map(({ row }) => row);
      const bundleIds = getSingleColumnFromResult({
        rows,
        columnsOrder,
        field: BUNDLE_ID,
      }).map((r) => Number(r));

      dialogStoreActions.openDialog({
        payload: {
          caption: 'Bundles Removal',
          variant: 'error',
          component: (
            <ActionPreview
              rows={rows}
              columnsOrder={columnsOrder}
              message='The following bundles will be permanently removed'
            />
          ),
          actions: dialogActions.confirmCancel({
            onConfirm: () => {
              dialogStoreActions.closeDialog();
              mutate({ bundleIds });
            },
          }),
        },
      });
    },
  };

  const tableActions = {
    onEditRow: (offset: number) => {
      const row = viewRows[offset].row;
      const id = columnsOrder.findIndex((c) => c === BUNDLE_ID);
      if (row === undefined || id === -1) return;

      messageStoreActions.addMessage({
        content: {
          text: 'Invalid Bundle',
          duration: 5000,
        },
      });
      codeStoreActions.setActiveBundleId(Number(row[id]));
      navigate(routes.front.bundleView);
    },

    onInfoRow: () => {},
  };

  const isBusy = isFetching || isPending;
  return (
    <>
      {isBusy && <ScreenLoader />}
      <PageHeader
        actions={headerActions}
        store={tableStore}
        expansionRef={tableRef}
        title='Stored Bundles'
      />
      <EffectiveTableWrapper
        outerRef={outerRef}
        resizeLineRef={resizeLineRef}
        tableRef={tableRef}
      >
        <TableContainer
          rows={viewRows}
          columnsOrder={columnsOrder}
          store={tableStore}
          outerRef={outerRef}
          tableRef={tableRef}
          resizeLineRef={resizeLineRef}
          actions={tableActions}
        />
      </EffectiveTableWrapper>
    </>
  );
};
