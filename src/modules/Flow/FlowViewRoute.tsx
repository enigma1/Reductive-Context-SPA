/* File src/modules/Flow/FlowViewRoute.tsx
  landing route for a specific flow
*/
import { useCallback, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type OnConnect,
  type IsValidConnection,
  type NodeChange,
  type EdgeChange,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from '>/services/stores';
import { RoleNode } from './RoleNode';
import { McpNode } from './McpNode';
import { ToolEdge } from './ToolEdge';

const nodeTypes = { role: RoleNode, mcp: McpNode };
const edgeTypes = { tool: ToolEdge };

export const FlowViewRoute = () => {
  // The critical validation: MCP can only connect to a Role's tool-input handle
  const isValidConnection: IsValidConnection = useCallback((edge) => {
    // MCP source → Role tool-input target
    // Role source → Role target (flow)
    // Reject: MCP → Role left handle, Role → MCP, Role tool-input → anything
    if (edge.sourceHandle === 'tool-input') return false; // tool-input is target-only
    return true;
  }, []);

  const { screenToFlowPosition } = useReactFlow();

  const { currentFlow, flowGraphs, setGraphs, setCurrentFlow, getGraph } =
    useFlowStore(({ state, api }) => ({
      currentFlow: state.currentFlow,
      flowGraphs: state.flowGraphs,
      getGraph: api.getGraph,
      setGraphs: api.setGraphs,
      setCurrentFlow: api.setCurrentFlow,
    }));

  const activeGraph = currentFlow ? flowGraphs[currentFlow] : undefined;
  const nodes = activeGraph?.nodes ?? [];
  const edges = activeGraph?.edges ?? [];

  // Write changes back to the store (debounced or on each change)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!currentFlow) return;
      const existing = getGraph(currentFlow) ?? { nodes: [], edges: [] };
      const updated = applyNodeChanges(changes, existing.nodes);
      setGraphs({ [currentFlow]: { nodes: updated, edges: existing.edges } });
    },
    [currentFlow, getGraph, setGraphs],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!currentFlow) return;
      const existing = getGraph(currentFlow) ?? { nodes: [], edges: [] };
      const updated = applyEdgeChanges(changes, existing.edges);
      setGraphs({ [currentFlow]: { nodes: existing.nodes, edges: updated } });
    },
    [currentFlow, getGraph, setGraphs],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!currentFlow) return;

      const isToolEdge = params.targetHandle === 'tool-input';
      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: isToolEdge ? 'tool' : 'default',
        animated: !isToolEdge,
      };

      const existing = getGraph(currentFlow) ?? {
        nodes: [],
        edges: [],
      };

      setGraphs({
        [currentFlow]: {
          nodes: existing.nodes,
          edges: [...existing.edges, newEdge],
        },
      });
    },
    [currentFlow, setGraphs],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    [currentFlow, setGraphs, setCurrentFlow, screenToFlowPosition],
  );

  return (
    <div className='wrapper full' onDragOver={onDragOver} onDrop={onDrop}>
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
        connectionMode={ConnectionMode.Strict}
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
