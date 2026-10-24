import { dialogStoreActions } from '>/services/stores';
import { dialogFactories } from '>/modules';

type RoleControlProps = {
  roleName: string;
};
export const RoleControls = ({ roleName }: RoleControlProps) => {
  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setRole({ name }),
    });
  };

  return (
    <>
      <button className='btn' onClick={() => onEdit(roleName)}>
        Edit
      </button>
    </>
  );
};
