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
  dialogFactories,
  ScreenLoader,
  TableContainer,
  TablePageHeader,
  EffectiveTableWrapper,
  ActionPreview,
  DialogContent,
} from '>/modules';
import { routes, BUNDLE_ID, BUNDLE_PROMPT } from '>/config';
import { getSingleColumnFromResult, intoViewRows } from '>/services/utils';
import { DeleteBundlesResponse } from '>/contracts';
import { JsonArray } from '>/types';
import { BundleInfoDlg } from './BundleInfoDlg';

export const BundleListRoute = () => {
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

  const deleteCallbacks = {
    onSuccess: (data: DeleteBundlesResponse) => {
      tableStore.api.clearSelected();
      codeStoreActions.setBundleSession();
      codeStoreActions.setActiveFile();
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `Delete Operation Failed.`,
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

  const viewRows = useMemo(() => {
    return intoViewRows(rows as JsonArray[]);
  }, [rows]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isPending;

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

      const onConfirm = () => {
        dialogStoreActions.closeDialog();
        mutate({ bundleIds });
      };

      dialogStoreActions.openDialog({
        payload: dialogFactories.deleteTableEntries({
          columnsOrder,
          rows,
          onConfirm,
        }),
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

    onInfoRow: (offset: number) => {
      const row = viewRows[offset].row;
      const id = columnsOrder.findIndex((c) => c === BUNDLE_ID);
      const bId = Number(row[id]);
      dialogStoreActions.openDialog({
        payload: {
          caption: `Info on Bundle ID: ${bId}`,
          component: <BundleInfoDlg bundleId={bId} />,
          actions: dialogActions.ack(),
        },
      });
    },
  };

  return (
    <>
      {isBusy && <ScreenLoader />}
      <TablePageHeader
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
