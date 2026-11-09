import { ListRestartIcon, ChevronsLeftRightEllipsisIcon } from 'lucide-react';
import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { dialogFactories } from '>/modules';

type RoleListHeaderProps = {
  onRefresh: () => void;
};
export const RoleListHeader = ({ onRefresh }: RoleListHeaderProps) => {
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

type RoleControlProps = {
  roleName: string;
};
export const RoleControls = ({ roleName }: RoleControlProps) => {
  const { currentRole, setCurrentRole } = useConfigStore(({ state, api }) => ({
    currentRole: state.currentRole,
    setCurrentRole: api.setCurrentRole,
  }));

  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setRole({ name }),
    });
  };

  const onActivate = (name: string) => {
    setCurrentRole(name);
  };

  return (
    <div className='one-line no-stretch'>
      <button className='btn-secondary' onClick={() => onEdit(roleName)}>
        Edit
      </button>
      <button
        className='btn'
        onClick={() => onActivate(roleName)}
        data-status={currentRole === roleName ? 'disabled' : undefined}
      >
        Activate
      </button>
    </div>
  );
};
