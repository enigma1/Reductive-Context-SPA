import { ListRestartIcon } from 'lucide-react';
import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { dialogFactories } from '>/modules';

type RoleListHeaderProps = {
  onRefresh: () => void;
};
export const RoleListHeader = ({ onRefresh }: RoleListHeaderProps) => {
  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
    </>
  );
  return commonActions;
};

type RoleControlProps = {
  roleName: string;
};
export const RoleControls = ({ roleName }: RoleControlProps) => {
  const { currentRole } = useConfigStore(({ state, api }) => ({
    currentRole: state.currentRole,
  }));
  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setRole({ name }),
    });
  };

  return (
    <div className='one-line no-stretch'>
      <button className='btn-secondary' onClick={() => onEdit(roleName)}>
        Edit
      </button>
      <button
        className='btn'
        onClick={() => onEdit(roleName)}
        data-status={currentRole === roleName ? 'disabled' : undefined}
      >
        Activate
      </button>
    </div>
  );
};
