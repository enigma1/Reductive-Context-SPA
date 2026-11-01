// nodes/McpNode.tsx
import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';

export type McpNodeData = {
  serverName: string;
  transport: 'stdio' | 'http';
  url?: string;
};

export type McpNodeType = Node<McpNodeData>;

export const McpNode = memo(({ data, selected }: NodeProps<McpNodeType>) => (
  <div className={`mcp-node ${selected ? 'selected' : ''}`}>
    <div className='mcp-node__header'>
      <span className='mcp-node__icon'>🔌</span>
      <span className='mcp-node__label'>{data.serverName}</span>
    </div>
    <div className='mcp-node__transport'>{data.transport}</div>

    {/* Source: connects TO a RoleNode's tool-input handle */}
    <Handle type='source' position={Position.Right} className='handle--tool' />
  </div>
));
