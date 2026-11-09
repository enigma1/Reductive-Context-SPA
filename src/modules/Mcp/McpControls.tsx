import { ListRestartIcon, ChevronsLeftRightEllipsisIcon } from 'lucide-react';
import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { dialogFactories } from '>/modules';

type McpListHeaderProps = {
  onRefresh: () => void;
};
export const McpListHeader = ({ onRefresh }: McpListHeaderProps) => {
  const { listMode, setListMode } = useConfigStore(({ state, api }) => ({
    listMode: state.listMode,
    setListMode: api.setListMode,
  }));

  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
      <button
        className='btn-secondary'
        onClick={() => setListMode(listMode === 'card' ? 'table' : 'card')}
        title={
          listMode === 'card'
            ? 'Switch to table listing'
            : 'Switch into card listing'
        }
      >
        <ChevronsLeftRightEllipsisIcon
          className={listMode === 'table' ? '-rotate-90' : ''}
          size={24}
        />
      </button>
    </>
  );
  return commonActions;
};

type McpControlProps = {
  mcpName: string;
};

export const McpControls = ({ mcpName }: McpControlProps) => {
  const { currentMcp, setCurrentMcp } = useConfigStore(({ state, api }) => ({
    currentMcp: state.currentMcp,
    setCurrentMcp: api.setCurrentMcp,
  }));

  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setMcp({ name }),
    });
  };

  const onDelete = (name: string) => {};

  return (
    <div className='one-line no-stretch'>
      <button className='btn-secondary' onClick={() => onEdit(mcpName)}>
        Edit
      </button>
      <button
        className='btn'
        onClick={() => onDelete(mcpName)}
        data-status={currentMcp === mcpName ? 'disabled' : undefined}
      >
        Delete
      </button>
    </div>
  );
};
