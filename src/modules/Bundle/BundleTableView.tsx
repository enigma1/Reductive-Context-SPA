import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  type ContextTableStore,
  configStoreActions,
  codeStoreActions,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import {
  dialogFactories,
  TableContainer,
  TablePageHeader,
  EffectiveTableWrapper,
} from '>/modules';
import { routes, BUNDLE_ID } from '>/config';
import { getSingleColumnFromResult, intoViewRows } from '>/services/utils';
import type { ColumnRecords } from '>/contracts';
import { JsonArray, ViewRow, DataRows } from '>/types';

type BundleTableViewProps = {
  rows: JsonArray;
  columnsOrder: string[];
  cols: ColumnRecords;
  onRefetch: () => void;
  onConfirmDelete: ({ bundleIds }: { bundleIds: number[] }) => void;
  tableStore: ContextTableStore;
};

export const BundleTableView = ({
  rows,
  columnsOrder,
  cols,
  onRefetch,
  onConfirmDelete,
  tableStore,
}: BundleTableViewProps) => {
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const viewRows = useMemo(() => {
    return intoViewRows(rows as DataRows);
  }, [rows]);

  const headerActions = {
    onDelete: () => {
      const selectedRows = tableStore.get().selectedRows;
      if (selectedRows.size === 0) {
        return;
      }
      const dRows = [...selectedRows.values()].map(({ row }) => row);
      const bundleIds = getSingleColumnFromResult({
        rows: dRows,
        columnsOrder,
        field: BUNDLE_ID,
      }).filter((item): item is number => typeof item === 'number');

      const onConfirm = () => {
        dialogStoreActions.closeDialog();
        onConfirmDelete({ bundleIds });
      };

      dialogStoreActions.openDialog({
        payload: dialogFactories.deleteTableEntries({
          columnsOrder,
          rows: dRows,
          onConfirm,
        }),
      });
    },
    onToggle: () => {
      configStoreActions.setListMode('card');
    },
    onRefetch,
  };

  const tableActions = {
    onEditRow: (offset: number) => {
      const row = viewRows[offset].row;
      console.log('row', viewRows[offset]);
      const id = columnsOrder.findIndex((c) => c === BUNDLE_ID);
      if (row === undefined || id === -1) {
        messageStoreActions.addMessage({
          content: {
            text: 'Invalid Bundle',
            duration: 5000,
          },
        });
        return;
      }
      codeStoreActions.setActiveBundleId(Number(row[id]));
      navigate(routes.front.bundleView);
    },
  };

  return (
    <>
      <TablePageHeader
        actions={headerActions}
        store={tableStore}
        expansionRef={tableRef}
        title="Existing Bundles"
      />
      <EffectiveTableWrapper
        outerRef={outerRef}
        resizeLineRef={resizeLineRef}
        tableRef={tableRef}
      >
        <TableContainer
          rows={viewRows as unknown as ViewRow<JsonArray>[]}
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
