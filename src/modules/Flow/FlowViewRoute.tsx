/* File src/modules/Flow/FlowViewRoute.tsx
  landing route for a specific flow
*/
import { useState, useCallback, type DragEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  MarkerType,
  type OnConnect,
  type IsValidConnection,
  type NodeChange,
  type EdgeChange,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ListRestartIcon,
  SaveCheckIcon,
  ArrowLeftToLineIcon,
} from 'lucide-react';
import { useCreateFlow, useSetFlow, useGetFlow } from '>/services/queryHooks';
import { routes } from '>/config';
import { useFlowStore } from '>/services/stores';
import { InputField, ScreenLoader } from '>/modules';
import { RoleNode } from './RoleNode';
import { McpNode } from './McpNode';
import { ToolEdge } from './ToolEdge';

const nodeTypes = { role: RoleNode, mcp: McpNode };
const edgeTypes = { tool: ToolEdge };

export const FlowViewRoute = () => {
  const [flowChanged, setFlowChanged] = useState<boolean>();
  const navigate = useNavigate();
  const { currentFlow, flowGraphs, setGraphs, setCurrentFlow, getGraph } =
    useFlowStore(({ state, api }) => ({
      currentFlow: state.currentFlow,
      flowGraphs: state.flowGraphs,
      getGraph: api.getGraph,
      setGraphs: api.setGraphs,
      setCurrentFlow: api.setCurrentFlow,
    }));

  const { flowName } = useGetFlow(
    { name: currentFlow ?? '' },
    ({ state, api }) => ({
      flowName: state.flowName,
    }),
  );

  const activeGraph = currentFlow ? flowGraphs[currentFlow] : undefined;
  const nodes = activeGraph?.nodes ?? [];
  const edges = activeGraph?.edges ?? [];

  // Validation: ensure tool-source connects to tool-target, prevent self-connections, and restrict to single connection between any two nodes
  const isValidConnection: IsValidConnection = useCallback(
    (edge) => {
      if (edge.source === edge.target) return false;
      if (edge.sourceHandle === 'tool-target') return false;
      if (edge.targetHandle === 'tool-source') return false;

      // Prevent multiple connections between the same source and target nodes
      const existingEdges = edges;
      const alreadyConnected = existingEdges.some(
        (e) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source),
      );
      if (alreadyConnected) return false;

      return true;
    },
    [edges],
  );

  const { screenToFlowPosition } = useReactFlow();

  // Write changes back to the store (debounced or on each change)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!currentFlow) return;
      const hasMutation = changes.some(
        (c) => c.type === 'position' || c.type === 'remove',
      );
      if (hasMutation) setFlowChanged(true);
      const existing = getGraph(currentFlow) ?? { nodes: [], edges: [] };
      const updated = applyNodeChanges(changes, existing.nodes);
      setGraphs({ [currentFlow]: { nodes: updated, edges: existing.edges } });
    },
    [currentFlow, getGraph, setGraphs],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!currentFlow) return;

      setFlowChanged(true);
      const existing = getGraph(currentFlow) ?? { nodes: [], edges: [] };
      const updated = applyEdgeChanges(changes, existing.edges);
      setGraphs({ [currentFlow]: { nodes: existing.nodes, edges: updated } });
    },
    [currentFlow, getGraph, setGraphs],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!currentFlow) return;

      const isToolEdge =
        params.sourceHandle === 'tool-source' ||
        params.targetHandle === 'tool-target';

      const existing = getGraph(currentFlow) ?? { nodes: [], edges: [] };
      const isMcpEdge =
        existing.nodes.find((n) => n.id === params.source)?.type === 'mcp' ||
        existing.nodes.find((n) => n.id === params.target)?.type === 'mcp';

      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: isToolEdge ? 'tool' : 'default',
        animated: !isToolEdge,
        ...(isMcpEdge && {
          markerStart: { type: MarkerType.ArrowClosed },
          markerEnd: { type: MarkerType.ArrowClosed },
        }),
      };
      setFlowChanged(true);
      setGraphs({
        [currentFlow]: {
          nodes: existing.nodes,
          edges: [...existing.edges, newEdge],
        },
      });
    },
    [currentFlow, getGraph, setGraphs],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      const { type, name } = JSON.parse(raw);
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode = {
        id: `n-${Date.now()}`,
        type,
        position,
        data: type === 'role' ? { roleName: name } : { mcpName: name },
      };

      const flowName = currentFlow ?? `flow-${Date.now()}`;
      if (!currentFlow) setCurrentFlow(flowName);

      // Always read the latest state, not the stale closure value
      const existing = getGraph(flowName) ?? {
        nodes: [],
        edges: [],
      };

      setGraphs({
        [flowName]: {
          nodes: [...existing.nodes, newNode],
          edges: existing.edges,
        },
      });
      setFlowChanged(true);
    },
    [currentFlow, getGraph, setGraphs, setCurrentFlow, screenToFlowPosition],
  );

  // ----------------
  // No-Hooks Section
  // ----------------
  const onRefetch = () => {};

  const onSave = () => {
    const graph = {
      flowName: currentFlow,
      flowIcon: undefined,
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data,
      })),
      edges: edges.map(
        ({ id, source, target, sourceHandle, targetHandle, type }) => ({
          id,
          source,
          target,
          sourceHandle,
          targetHandle,
          type,
        }),
      ),
    };

    // if (isNewFlow) {
    //   mutateCreateFlow(graph);
    //   return;
    // }

    // if (!currentFlow) return;

    // mutateUpdateFlow({ ...graph, orgName });
    // // setFlowChanged(false);
  };

  const onGoBack = () => {
    navigate(routes.front.flowList);
  };

  return (
    <>
      <div className="page-heading">
        <div className="page-toolbar">
          <div className="inline-wrapper">
            <button
              className="btn-micro"
              title="Back to the flow List"
              onClick={onGoBack}
            >
              <ArrowLeftToLineIcon size={18} />
            </button>
            <div
              className="page-title"
              title={`Editing ${currentFlow ?? 'New Flow'}`}
            >
              {currentFlow ?? 'New Flow'}
            </div>
          </div>
          <div className="page-actions">
            <InputField
              id="flow-name"
              label="Flow Name:"
              value={currentFlow ?? ''}
              title={`Flow Name`}
              onValueChange={(value) => {
                setCurrentFlow(value);
              }}
              $status={flowChanged && !currentFlow ? 'error' : undefined}
              placeholder="Flow Name"
              wrapLayout="inline"
            />
            {currentFlow && (
              <button
                className="btn-secondary"
                onClick={onRefetch}
                title={`Refetch ${currentFlow}`}
              >
                <ListRestartIcon size={24} />
              </button>
            )}
            <button
              className="btn"
              onClick={onSave}
              title="Save Flow"
              data-status={!flowChanged ? 'disabled' : undefined}
            >
              <SaveCheckIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="page-content" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
          }}
          connectionMode={ConnectionMode.Strict}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background gap={16} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  );
};
