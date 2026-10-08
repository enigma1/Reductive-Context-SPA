import { useMemo, type RefObject } from 'react';
import { SquarePenIcon, PencilLineIcon, CopyIcon } from 'lucide-react';
import { useColumnResize } from '>/services/hooks';
import { CheckboxField } from '>/modules';
import { getMergedSimpleColumnData } from '>/services/utils';
import { ViewRow, JsonTypes, JsonObject, JsonArray } from '>/types';
import type { ContextTableStore } from '>/services/stores';

type EditHandlerProps = {
  row: JsonTypes[];
  rId: number;
  cId: number;
  colName: string;
};

type TableContainerProps = {
  rows: ViewRow<JsonArray>[];
  activeCols?: string[];
  columnsOrder: string[];
  store: ContextTableStore;
  outerRef: RefObject<HTMLDivElement | null>;
  tableRef: React.RefObject<HTMLTableElement | null>;
  resizeLineRef: RefObject<HTMLDivElement | null>;
  editedRow?: Record<string, JsonObject>;
  selectedRow?: string;
  onEditCell?: (props: EditHandlerProps) => void;
  onEditRow?: (offset: number) => void;
  onSelectRow?: (offset: number) => void;
  onCopyRow?: (offset: number) => void;
};

export const TableContainer = ({
  rows,
  columnsOrder,
  activeCols,
  store,
  outerRef,
  resizeLineRef,
  tableRef,
  editedRow,
  selectedRow,
  onEditCell,
  onEditRow,
  onSelectRow,
  onCopyRow,
}: TableContainerProps) => {
  const visibleColumns = activeCols ?? columnsOrder;
  const { useContextTableStore } = store;
  const columnIndices = useMemo(
    () => Object.fromEntries(columnsOrder.map((name, idx) => [name, idx])),
    [columnsOrder],
  );

  const { setSelectedRow, selectedRows } = useContextTableStore(
    ({ state, api }) => ({
      setSelectedRow: api.setSelectedRow,
      selectedRows: state.selectedRows,
    }),
  );

  const { colWidths, startResize } = useColumnResize(
    columnsOrder,
    outerRef,
    resizeLineRef,
  );
  const isEditable = onEditCell;
  const showCheckbox = onEditRow || onCopyRow || onSelectRow;

  return (
    <table className='table' ref={tableRef}>
      <thead>
        <tr>
          {showCheckbox && <th />}
          {visibleColumns.map((colName) => {
            return (
              <th
                key={`col-${colName}`}
                style={{ width: `${colWidths[colName]}px` }}
              >
                <div className='col-header'>
                  <span className='truncate'>{colName}</span>
                </div>
                <div
                  onPointerDown={(e) => startResize(e, colName)}
                  className='col-handle'
                />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((oRow, idx) => {
          const offset = oRow.offset;
          const row = editedRow
            ? getMergedSimpleColumnData(oRow.row, editedRow[offset])
            : oRow.row;
          const rowBg = editedRow?.[offset]
            ? 'changed'
            : idx % 2 === 0
              ? 'even'
              : 'odd';
          return (
            <tr key={`row-${offset}-${idx}`} className={`${rowBg}`}>
              {showCheckbox && (
                <td className='align-middle'>
                  <div className='flex items-center gap-2'>
                    <CheckboxField
                      wrapLayout='stack'
                      checked={selectedRows.has(offset)}
                      onChange={(checked) => {
                        setSelectedRow(oRow, checked);
                      }}
                    />
                    {onCopyRow && (
                      <button
                        title='Copy this row'
                        className='btn-secondary p-0 bg-transparent border-0'
                        onClick={(e) => {
                          onCopyRow(offset);
                        }}
                      >
                        <CopyIcon size={18} className='inline-block' />
                      </button>
                    )}

                    {onEditRow && (
                      <button
                        className='btn-secondary p-0 bg-transparent border-0'
                        onClick={() => onEditRow(offset)}
                      >
                        <PencilLineIcon size={18} className='inline-block' />
                      </button>
                    )}
                  </div>
                </td>
              )}
              {visibleColumns.map((colName) => {
                const colIndex = columnIndices[colName];
                const getValue = () => {
                  const value = row[colIndex];
                  if (value === null) return 'NULL';
                  if (typeof value === 'object') {
                    return (
                      <pre className='whitespace-pre-wrap'>
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    );
                  }
                  return String(value);
                };

                return isEditable ? (
                  <td
                    key={colIndex}
                    className={`editable ${editedRow?.[offset]?.[colIndex] ? 'selected' : ''}`}
                  >
                    {getValue()}

                    <button
                      className='btn p-0 edit'
                      onClick={() =>
                        onEditCell({
                          row: [...row],
                          rId: offset,
                          cId: colIndex,
                          colName,
                        })
                      }
                    >
                      <SquarePenIcon size={18} />
                    </button>
                  </td>
                ) : (
                  <td key={colIndex}>{getValue()}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
