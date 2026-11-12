import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { useDeleteRoles } from '>/services/queryHooks';
import { dialogFactories } from '>/modules';
import { ROLE_NAME } from '>/config';

type RoleControlProps = {
  roleName: string;
};
export const RoleControls = ({ roleName }: RoleControlProps) => {
  const { currentRole, setCurrentRole } = useConfigStore(({ state, api }) => ({
    currentRole: state.currentRole,
    setCurrentRole: api.setCurrentRole,
  }));
  const { mutate, isPending } = useDeleteRoles(({ query, api }) => ({
    mutate: api.mutate,
    isPending: query.isPending,
  }));

  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setRole({ name }),
    });
  };

  const onDelete = () => {
    if (isPending) return;
    const columnsOrder = [ROLE_NAME];
    const rows = [[roleName]];

    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ roleNames: [roleName] });
    };

    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };

  const onActivate = (name: string) => {
    setCurrentRole(name);
  };

  return (
    <div className="one-line no-stretch">
      <button className="btn-secondary" onClick={() => onEdit(roleName)}>
        Edit
      </button>
      <button
        className="btn"
        onClick={() => onActivate(roleName)}
        data-status={currentRole === roleName ? 'disabled' : undefined}
      >
        Activate
      </button>
      <button
        className="btn"
        onClick={onDelete}
        data-status={currentRole === roleName ? 'disabled' : undefined}
      >
        Delete
      </button>
    </div>
  );
};
