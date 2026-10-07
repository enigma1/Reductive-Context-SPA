import { NOT_SET } from '>/config';
import { CheckboxField } from '>/modules';
import type { ViewRow, DataRow } from '>/types';

export type MiniTableOptions = {
  showNotSet?: boolean;
  showCheckboxes?: boolean;
  extraClasses?: string;
};

type MiniTableProps = {
  rows: ViewRow<DataRow>[];
  columnsOrder: string[];
  selectedRows?: Record<string, boolean>;
  onSelectRow?: (offset: number, selected: boolean) => void;
  options?: MiniTableOptions;
};

export const MiniTable = ({
  rows,
  columnsOrder,
  selectedRows,
  onSelectRow,
  options,
}: MiniTableProps) => {
  const {
    showCheckboxes = false,
    showNotSet = false,
    extraClasses = 'w-full',
  } = options ?? {};

  return (
    <table className={`table table-fixed ${extraClasses}`}>
      <thead>
        <tr>
          {showCheckboxes && <th className='w-8' />}
          {columnsOrder.map((colName, cidx) => (
            <th key={`mini-th-${colName}-${cidx}`}>
              <div className='truncate px-2 py-1'>{colName}</div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(({ row, offset }, idx) => {
          const rowBg = idx % 2 === 0 ? 'even' : 'odd';

          return (
            <tr
              key={`mini-tr-${idx}`}
              className={rowBg}
              onClick={() => {
                onSelectRow?.(offset, !(selectedRows?.[offset] ?? false));
              }}
            >
              {showCheckboxes && (
                <td
                  className='align-middle w-8'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='flex items-center gap-2'>
                    <CheckboxField
                      wrapLayout='stack'
                      checked={selectedRows?.[offset] ?? false}
                      onChange={(checked) => {
                        onSelectRow?.(offset, checked);
                      }}
                    />
                  </div>
                </td>
              )}
              {columnsOrder.map((_, cidx) => {
                const getValue = () => {
                  const value = row[cidx];
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
                const value = getValue();
                const cellClass =
                  showNotSet && value !== NOT_SET ? 'icon-warn' : '';
                return (
                  <td
                    key={`mini-td-${idx}-${cidx}`}
                    className={`${cellClass} truncate`}
                  >
                    {getValue()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
