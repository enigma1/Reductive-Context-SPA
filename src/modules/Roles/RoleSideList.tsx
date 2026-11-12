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

  const { getColumnValues, isFetching } = useGetRoleList(
    undefined,
    ({ api, query }) => ({
      getColumnValues: api.getColumnValues,
      isFetching: query.isFetching,
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
  const roles = getColumnValues(['roleName']);
  return (
    <div className="side-list">
      {roles.length > 0 ? (
        <>
          {roles.map(([name], idx) => {
            if (typeof name !== 'string') return 'error';
            const isSelected = currentRole === name;
            return (
              <div
                className="btn-group side-list-item min-w-0 gap-0.5"
                key={`${name}-${idx}`}
              >
                <button
                  className="btn-side field-error"
                  onClick={() => onDeleteRole(name)}
                >
                  <FileXIcon size={16} />
                </button>
                <button
                  className="truncate min-w-0 flex-1 text-left"
                  data-active={isSelected}
                  onClick={() => {
                    setCurrentRole(name);
                    navigate(routes.front.roleList);
                  }}
                  draggable
                  onDragStart={(e) => onDragStart(e, 'role', name)}
                >
                  {name}
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <div className="side-list-empty">No Roles Found</div>
      )}
    </div>
  );
};
