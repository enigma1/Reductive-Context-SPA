import { useRef, useMemo } from 'react';
import {
  createContextTableStore,
  configStoreActions,
  dialogStoreActions,
} from '>/services/stores';
import {
  dialogFactories,
  TableContainer,
  TablePageHeader,
  EffectiveTableWrapper,
} from '>/modules';
import { ROLE_NAME } from '>/config';
import { getSingleColumnFromResult, intoViewRows } from '>/services/utils';
import type { ColumnRecords } from '>/contracts';
import { JsonArray, ViewRow, DataRows } from '>/types';

type RoleTableViewProps = {
  rows: JsonArray;
  columnsOrder: string[];
  cols: ColumnRecords;
  onRefetch: () => void;
  onConfirmDelete: ({ names }: { names: string[] }) => void;
};

export const RoleTableView = ({
  rows,
  columnsOrder,
  cols,
  onRefetch,
  onConfirmDelete,
}: RoleTableViewProps) => {
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const { tableStore } = useMemo(() => {
    const store = createContextTableStore();
    return {
      tableStore: store,
    };
  }, []);

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
      const names = getSingleColumnFromResult({
        rows: dRows,
        columnsOrder,
        field: ROLE_NAME,
      }).filter((item): item is string => typeof item === 'string');

      const onConfirm = () => {
        dialogStoreActions.closeDialog();
        // mutate({ names });
        onConfirmDelete({ names });
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
      const idx = columnsOrder.findIndex((c) => c === ROLE_NAME);
      const name = viewRows[offset].row[idx];
      if (!name || idx === -1 || typeof name !== 'string') return;

      configStoreActions.setCurrentRole(name);
      dialogStoreActions.openDialog({
        payload: dialogFactories.setRole({ name }),
      });
    },
  };

  return (
    <>
      <TablePageHeader
        actions={headerActions}
        store={tableStore}
        expansionRef={tableRef}
        title="Roles"
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
