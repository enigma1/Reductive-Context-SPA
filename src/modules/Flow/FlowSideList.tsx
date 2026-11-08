import { useLocation, useNavigate } from 'react-router';
import { FileXIcon } from 'lucide-react';
import { routes } from '>/config';
import { useDeleteFlows, useGetFlowList } from '>/services/queryHooks';
import {
  useFlowStore,
  useConfigStore,
  dialogStoreActions,
} from '>/services/stores';
import { ScreenLoader, dialogFactories } from '>/modules';

export const FlowSideList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentFlow, setCurrentFlow } = useFlowStore(({ state, api }) => ({
    currentFlow: state.currentFlow,
    setCurrentFlow: api.setCurrentFlow,
  }));

  const { flows, isFetching, refetch } = useGetFlowList(
    undefined,
    ({ state, query }) => ({
      flows: state.flows,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const flowsList = Object.entries(flows).map((item) => item[1]);

  const { mutate, isPending } = useDeleteFlows(({ query, api }) => ({
    mutate: api.mutate,
    isPending: query.isPending,
  }));

  const isBusy = isFetching || isPending;
  if (isBusy) return <ScreenLoader />;

  const onDeleteFlow = (name: string) => {
    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ flowNames: [name] });
      if (location.pathname !== routes.front.flowList)
        navigate(routes.front.flowList);
    };

    const columnsOrder = ['Flow Name'];
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
      {flowsList.length > 0 ? (
        <>
          {flowsList.map((flow, idx) => {
            const isSelected = currentFlow === flow.flowName;
            return (
              <div
                className='btn-group side-list-item min-w-0 gap-0.5'
                key={`${flow}-${idx}`}
              >
                <button
                  className='btn-side field-error'
                  onClick={() => onDeleteFlow(flow.flowName)}
                >
                  <FileXIcon size={16} />
                </button>
                <button
                  className='truncate min-w-0 flex-1 text-left'
                  data-active={isSelected}
                  onClick={() => {
                    setCurrentFlow(flow.flowName);
                    navigate(routes.front.flowList);
                  }}
                >
                  {flow.flowName}
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <div className='side-list-empty'>No Flows Found</div>
      )}
    </div>
  );
};
