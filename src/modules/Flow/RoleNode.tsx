// nodes/RoleNode.tsx
import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useGetRole } from '>/services/queryHooks';
import { useFileAsDataUrl } from '>/services/hooks';
import { ScreenLoader } from '>/modules';

export type RoleNodeData = {
  roleName: string;
};

export type RoleNodeType = Node<RoleNodeData>;

export const RoleNode = memo(({ data, selected }: NodeProps<RoleNodeType>) => {
  const { name, roleMain, image, isFetching, refetch } = useGetRole(
    { name: data.roleName },
    ({ query, state }) => ({
      name: state.name,
      roleMain: state.roleMain,
      image: state.image,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const imageUrl = useFileAsDataUrl(image);
  const isBusy = isFetching;

  return (
    <>
      {isBusy && <ScreenLoader />}
      <div
        className={`node-container min-h-4 role-node ${selected ? 'role-selected' : ''}`}
      >
        {/* Flow: incoming from previous role */}
        <Handle type='target' position={Position.Left} />

        {/* Flow: outgoing to next role */}
        <Handle type='source' position={Position.Right} />

        {/* Tool: bottom node acts as source to send towards top node */}
        <Handle
          id='tool-source'
          type='source'
          position={Position.Bottom}
          className='handle--tool'
        />

        {/* Tool: top node acts as target to receive from bottom node */}
        <Handle
          id='tool-target'
          type='target'
          position={Position.Top}
          className='handle--tool'
        />

        <span className='text-sm'>{data.roleName}</span>
      </div>
    </>
  );
});
