import { useDeleteMcps } from '>/services/queryHooks';
import { dialogStoreActions, useConfigStore } from '>/services/stores';
import { dialogFactories } from '>/modules';
import { MCP_NAME } from '>/config';
type McpControlProps = {
  mcpName: string;
};

export const McpControls = ({ mcpName }: McpControlProps) => {
  const { currentMcp, setCurrentMcp } = useConfigStore(({ state, api }) => ({
    currentMcp: state.currentMcp,
    setCurrentMcp: api.setCurrentMcp,
  }));

  const { mutate, isPending } = useDeleteMcps(({ query, api }) => ({
    mutate: api.mutate,
    isPending: query.isPending,
  }));

  const onEdit = (name: string) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setMcp({ name }),
    });
  };

  const onDelete = () => {
    if (isPending) return;
    const columnsOrder = [MCP_NAME];
    const rows = [[mcpName]];

    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ mcpNames: [mcpName] });
    };

    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };

  return (
    <div className="one-line no-stretch">
      <button className="btn-secondary" onClick={() => onEdit(mcpName)}>
        Edit
      </button>
      <button
        className="btn"
        onClick={onDelete}
        data-status={currentMcp === mcpName ? 'disabled' : undefined}
      >
        Delete
      </button>
    </div>
  );
};
