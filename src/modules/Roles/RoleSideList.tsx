import { useLocation, useNavigate } from 'react-router';
import { FileXIcon } from 'lucide-react';
import { routes } from '>/config';
import { useGetRoleList, useDeleteRoles } from '>/services/queryHooks';
import { useConfigStore, dialogStoreActions } from '>/services/stores';
import { ScreenLoader, dialogFactories } from '>/modules';

export const RoleSideList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentRole, setCurrentRole } = useConfigStore(({ state, api }) => ({
    currentRole: state.currentRole,
    setCurrentRole: api.setCurrentRole,
  }));
  const { roles, isFetching, refetch } = useGetRoleList(
    undefined,
    ({ state, query }) => ({
      roles: state.roles,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { mutate, isPending } = useDeleteRoles(({ query, api }) => ({
    mutate: api.mutate,
    isPending: query.isPending,
  }));

  const isBusy = isFetching || isPending;
  if (isBusy) return <ScreenLoader />;

  const onDragStart = (
    e: React.DragEvent,
    type: 'role' | 'mcp',
    name: string,
  ) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ type, name }),
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDeleteRole = (name: string) => {
    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ roleNames: [name] });
      if (location.pathname !== routes.front.roleList)
        navigate(routes.front.roleList);
    };

    const columnsOrder = ['Role Name'];
    const rows = [[name]];
    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };
  return (
    <div className='side-list'>
      {roles.length > 0 ? (
        <>
          {roles.map((role, idx) => {
            const isSelected = currentRole === role.name;
            return (
              <div
                className='btn-group side-list-item min-w-0 gap-0.5'
                key={`${role}-${idx}`}
              >
                <button
                  className='btn-side field-error'
                  onClick={() => onDeleteRole(role.name)}
                >
                  <FileXIcon size={16} />
                </button>
                <button
                  className='truncate min-w-0 flex-1 text-left'
                  data-active={isSelected}
                  onClick={() => {
                    setCurrentRole(role.name);
                    navigate(routes.front.roleList);
                  }}
                  draggable
                  onDragStart={(e) => onDragStart(e, 'role', role.name)}
                >
                  {role.name}
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <div className='side-list-empty'>No Roles Found</div>
      )}
    </div>
  );
};
