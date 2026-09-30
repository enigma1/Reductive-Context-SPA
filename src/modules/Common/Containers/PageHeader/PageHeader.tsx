/* File: src/modules/Containers/PageHeader.tsx
  Contains title and controls for the main view of a page
*/
import { type ReactNode, useState } from 'react';

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
} from 'lucide-react';
import type { ContextTableStore } from '>/services/stores';
import { PageHeaderActions } from './types';

export type TableShellIndicators = {
  hasHiddenColumns: boolean;
};

export type PageTableShellProps = {
  title: ReactNode;
  store: ContextTableStore;
  actions?: PageHeaderActions;
  indicators: TableShellIndicators;
  notice?: ReactNode;
};

export const PageTableShell = ({
  store,
  actions,
  title,
  indicators,
  notice,
}: PageTableShellProps) => {
  const { useFactoryTableStore } = store;
  const { hasSelects, clearSelected } = useFactoryTableStore(
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

            {onFilterColumns && (
              <button
                className={`btn-secondary ${indicators.hasHiddenColumns ? 'emphasize' : ''}`}
                onClick={onFilterColumns}
                title='Select columns'
              >
                <TableColumnsSplitIcon size={24} />
              </button>
            )}
          </div>
          {notice && <div className='wrapper w-full page-notice'>{notice}</div>}
        </div>
      </div>
    </>
  );
};
