import { useState } from 'react';
import { ListRestartIcon } from 'lucide-react';
import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { dialogFactories } from '>/modules';

type McpListMode = 'table' | 'card';
type McpListHeaderProps = {
  onRefresh: () => void;
};
export const McpListHeader = ({ onRefresh }: McpListHeaderProps) => {
  const [listMode, setListMode] = useState<McpListMode>('card');
  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
      <button
        className='btn-secondary'
        onClick={() => setListMode(listMode === 'card' ? 'table' : 'card')}
        title='Refresh'
      >
        <ListRestartIcon size={24} />
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
