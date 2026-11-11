import { useLocation, useNavigate } from 'react-router';
import { FileXIcon } from 'lucide-react';
import { routes, MCP_NAME } from '>/config';
import { useGetMcpList, useDeleteMcps } from '>/services/queryHooks';
import { useConfigStore, dialogStoreActions } from '>/services/stores';
import { ScreenLoader, dialogFactories } from '>/modules';

export const McpSideList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentMcp, setCurrentMcp } = useConfigStore(({ state, api }) => ({
    currentMcp: state.currentMcp,
    setCurrentMcp: api.setCurrentMcp,
  }));

  const { getColumnValues, isFetching } = useGetMcpList(
    undefined,
    ({ api, query }) => ({
      getColumnValues: api.getColumnValues,
      isFetching: query.isFetching,
    }),
  );

  const { mutate, isPending } = useDeleteMcps(({ query, api }) => ({
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

  const onDeleteMcp = (name: string) => {
    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ mcpNames: [name] });
      if (location.pathname !== routes.front.mcpList)
        navigate(routes.front.mcpList);
    };

    const columnsOrder = ['MCP Name'];
    const rows = [[name]];
    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };

  const services = getColumnValues(['mcpName']);
  return (
    <div className="side-list">
      {services && services.length > 0 ? (
        <>
          {services.map(([name], idx) => {
            if (typeof name !== 'string') return 'error';

            const isSelected = currentMcp === name;
            return (
              <div
                className="btn-group side-list-item min-w-0 gap-0.5"
                key={`${name}-${idx}`}
              >
                <button
                  className="btn-side field-error"
                  onClick={() => onDeleteMcp(name)}
                >
                  <FileXIcon size={16} />
                </button>
                <button
                  className="truncate min-w-0 flex-1 text-left"
                  data-active={isSelected}
                  onClick={() => {
                    setCurrentMcp(name);
                    navigate(routes.front.mcpList);
                  }}
                  draggable
                  onDragStart={(e) => onDragStart(e, 'mcp', name)}
                >
                  {name}
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <div className="side-list-empty">No MCP Services Found</div>
      )}
    </div>
  );
};
