import type { ReactNode } from 'react';
import { intoViewRows } from '>/services/utils';
import type { DataInputProps } from '>/types';
import { type MiniTableOptions, MiniTable } from './Tables';

type ActionPreviewProps = DataInputProps & {
  message: ReactNode;
  options?: MiniTableOptions;
};

export const ActionPreview = ({
  rows,
  columnsOrder,
  message,
  options,
}: ActionPreviewProps) => {
  return (
    <>
      <p className='px-3 py-2 field-warn-bg stand'>{message}</p>
      <div className='table-wrapper'>
        <MiniTable
          columnsOrder={columnsOrder}
          rows={intoViewRows(rows)}
          options={options}
        />
      </div>
    </>
  );
};
