/* File: src/modules/Containers/PageHeader.tsx
  Contains title and controls for the main view of a page
*/
import { type ReactNode, type RefObject, useState } from 'react';

import {
  CaptionsIcon,
  CaptionsOffIcon,
  FileDownIcon,
  LayersMinusIcon,
  RouteOffIcon,
  TableColumnsSplitIcon,
  MapPlusIcon,
  DatabaseBackupIcon,
  SquareArrowLeftIcon,
  ListRestartIcon,
  ShrinkIcon,
} from 'lucide-react';
import type { ContextTableStore } from '>/services/stores';
import { compactTable } from '>/services/utils';

type PageHeaderActions = {
  onDiscardEdits?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  onExportCsv?: () => void;
  onCreate?: () => void;
  onDelete?: () => void;
  onFilterColumns?: () => void;
  onRefetch?: () => void;
  onBack?: () => void;
};

export type ColumnIndicators = {
  hasHiddenColumns: boolean;
};

export type PageHeaderProps = {
  title: ReactNode;
  store: ContextTableStore;
  actions?: PageHeaderActions;
  indicators?: ColumnIndicators;
  notice?: ReactNode;
  expansionRef?: RefObject<HTMLTableElement | null>;
};

export const PageHeader = ({
  store,
  actions,
  title,
  indicators,
  notice,
  expansionRef,
}: PageHeaderProps) => {
  const { useContextTableStore } = store;
  const { hasSelects, clearSelected } = useContextTableStore(
    ({ state, api }) => ({
      hasSelects: state.selectedRows.size > 0,
      clearSelected: api.clearSelected,
    }),
  );

  const shellActions = actions ?? {};
  const {
    onDiscardEdits,
    onSave,
    onDownload,
    onExportCsv,
    onCreate,
    onDelete,
    onFilterColumns,
    onRefetch,
    onBack,
  } = shellActions;
  const [isPacked, setIsPacked] = useState(false);
  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='page-title'>
            {onBack && (
              <button className='btn-micro' onClick={onBack} title='Go Back'>
                <SquareArrowLeftIcon size={18} />
              </button>
            )}
            {title}
          </div>
          <div className='page-actions'>
            {onCreate && (
              <button
                className='btn'
                onClick={onCreate}
                title='Create New Entry'
              >
                <MapPlusIcon size={24} />
              </button>
            )}
            {onDelete && hasSelects && (
              <button
                className='btn icon-critical'
                onClick={onDelete}
                title='Delete Entries'
              >
                <LayersMinusIcon size={24} />
              </button>
            )}

            {hasSelects && (
              <button
                className='btn-secondary'
                onClick={clearSelected}
                title='Clear Selected'
              >
                <RouteOffIcon size={24} />
              </button>
            )}
            {onDiscardEdits && (
              <button
                className='btn-secondary'
                onClick={onDiscardEdits}
                title='Discard changes'
              >
                <CaptionsOffIcon size={24} />
              </button>
            )}
            {onSave && (
              <button className='btn' onClick={onSave} title='Save changes'>
                <CaptionsIcon size={24} />
              </button>
            )}
            {onExportCsv && (
              <button
                className={`btn-secondary`}
                onClick={onExportCsv}
                title='Export all data in CSV format from all rows'
              >
                <FileDownIcon size={24} />
              </button>
            )}

            {onDownload && (
              <button
                className={`btn-secondary ${hasSelects && 'icon-warn'}`}
                onClick={onDownload}
                title='Export Data from all or selected Rows'
                disabled={!hasSelects}
              >
                <DatabaseBackupIcon size={24} />
              </button>
            )}

            {onRefetch && (
              <button
                className={`btn-secondary`}
                onClick={onRefetch}
                title='Refresh the Table'
              >
                <ListRestartIcon size={24} />
              </button>
            )}

            {onFilterColumns && indicators && (
              <button
                className={`btn-secondary ${indicators.hasHiddenColumns ? 'emphasize' : ''}`}
                onClick={onFilterColumns}
                title='Select columns'
              >
                <TableColumnsSplitIcon size={24} />
              </button>
            )}
          </div>
          {expansionRef && (
            <button
              title={isPacked ? 'Columns inline' : 'Pack columns'}
              className='btn-secondary'
              onClick={() => {
                if (expansionRef.current) {
                  const nextPacked = !isPacked;
                  setIsPacked(nextPacked);
                  compactTable(expansionRef.current, nextPacked);
                }
              }}
            >
              <ShrinkIcon size={24} />
            </button>
          )}

          {notice && <div className='wrapper w-full page-notice'>{notice}</div>}
        </div>
      </div>
    </>
  );
};
