import { type Node, type Edge } from '@xyflow/react';
import { makeState } from './estate';

type GraphItem = {
  nodes: Node[];
  edges: Edge[];
};
type FlowStore = {
  flowGraphs: Record<string, GraphItem>;
  currentFlow?: string;
};

const initialState: FlowStore = {
  flowGraphs: {},
};

const baseStore = makeState<FlowStore>(() => ({ ...initialState }));
const { get, setAuto } = baseStore;

export type flowStoreActions = {
  setGraphs: (graphs: Record<string, GraphItem>) => void;
  getGraph: (name: string) => GraphItem | undefined;
  getCurrentFlow: () => string | undefined;
  setCurrentFlow: (name?: string) => void;
};

export const flowStoreActions: flowStoreActions = {
  getGraph: (name) => {
    return get().flowGraphs[name];
  },
  setGraphs: (graphs) => {
    const flowGraphs = get().flowGraphs;
    setAuto({
      flowGraphs: {
        ...flowGraphs,
        ...graphs,
      },
    });
  },
  getCurrentFlow: () => get().currentFlow,
  setCurrentFlow: (name) => {
    setAuto({ currentFlow: name });
  },
};

type FlowProps = {
  state: FlowStore;
  api: typeof flowStoreActions;
};

export const useFlowStore = <TSelected = FlowProps>(
  selector?: (props: FlowProps) => TSelected,
): TSelected => {
  const state = baseStore();
  const api = flowStoreActions;

  return selector ? selector({ state, api }) : ({ state, api } as TSelected);
};
