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
        <Handle type='target' position={Position.Left} />

        <span className='font-medium'>{data.roleName}</span>
        {/* <div className='flex items-center gap-2'>
          <span>
            {image ? <img src={imageUrl} className='w-5 h-5 rounded' /> : '🤖'}
          </span>
          <span className='font-medium truncate max-w-[160px]'>
            {data.roleName}
          </span>
        </div>
        {roleMain && (
          <div className='text-xs opacity-60 mt-1 line-clamp-2 max-w-[180px]'>
            {roleMain}
          </div>
        )} */}

        <Handle type='source' position={Position.Right} />
        <Handle
          id='tool-input'
          type='target'
          position={Position.Bottom}
          className='handle--tool'
        />
      </div>
    </>
  );
});
