/* File src/modules/Flow/McpNode.tsx
  Draws a rectangle for the MCP json that can connect to various roles
*/
import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useGetMcp } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

export type McpNodeData = {
  mcpName: string;
};

export type McpNodeType = Node<McpNodeData>;

export const McpNode = memo(({ data, selected }: NodeProps<McpNodeType>) => {
  const { mcpName, mcpTransport, mcpIcon, isFetching, refetch } = useGetMcp(
    { name: data.mcpName },
    ({ query, state }) => ({
      mcpName: state.mcpName,
      mcpTransport: state.mcpTransport,
      mcpIcon: state.mcpIcon,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const isBusy = isFetching;

  return (
    <>
      {isBusy && <ScreenLoader />}
      <div
        className={`node-container min-h-4 mcp-node ${selected ? 'mcp-selected' : ''}`}
      >
        <div className="wrapper gap-1 p-2">
          <span className="text-sm">{mcpName}</span>
          <span className="text-xs text-muted-foreground">{mcpTransport}</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="handle--tool"
        />
      </div>
    </>
  );
});
