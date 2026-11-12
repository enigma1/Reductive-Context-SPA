import { useNavigate } from 'react-router';
import { useDeleteFlows } from '>/services/queryHooks';
import { dialogStoreActions, useFlowStore } from '>/services/stores';
import { routes, FLOW_NAME } from '>/config';
import { dialogFactories } from '>/modules';

type FlowControlProps = {
  flowName: string;
};

export const FlowControls = ({ flowName }: FlowControlProps) => {
  const navigate = useNavigate();
  const { currentFlow, setCurrentFlow } = useFlowStore(({ state, api }) => ({
    currentFlow: state.currentFlow,
    setCurrentFlow: api.setCurrentFlow,
  }));

  const { mutate, isPending } = useDeleteFlows(({ query, api }) => ({
    mutate: api.mutate,
    isPending: query.isPending,
  }));

  const onEdit = () => {
    setCurrentFlow(flowName);
    navigate(routes.front.flowView);
  };

  const onDelete = () => {
    if (isPending) return;
    const columnsOrder = [FLOW_NAME];
    const rows = [[flowName]];

    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ flowNames: [flowName] });
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
      <button className="btn-secondary" onClick={onEdit}>
        Edit
      </button>
      <button
        className="btn"
        onClick={onDelete}
        data-status={currentFlow === flowName ? 'disabled' : undefined}
      >
        Delete
      </button>
    </div>
  );
};
