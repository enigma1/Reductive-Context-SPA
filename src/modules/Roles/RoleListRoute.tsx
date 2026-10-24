import { useRef, useMemo } from 'react';
import { ListRestartIcon } from 'lucide-react';
import { useGetRoleList } from '>/services/queryHooks';
import { ScreenLoader, ListingPageHeader, Card } from '>/modules';
import { RoleControls } from './RoleControls';

type RoleListHeaderProps = {
  onRefresh: () => void;
};
export const RoleListHeader = ({ onRefresh }: RoleListHeaderProps) => {
  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
    </>
  );
  return commonActions;
};

export const RoleListRoute = () => {
  const { roles, isFetching, refetch } = useGetRoleList(
    undefined,
    ({ state, query }) => ({
      roles: state.roles,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const isBusy = isFetching;
  if (isBusy) return <ScreenLoader />;

  const headerActions = {
    onRefresh: () => {
      refetch();
    },
  };

  return (
    <>
      <ListingPageHeader
        title='Profiles & Roles'
        actions={<RoleListHeader {...headerActions} />}
      />
      <div className='page-content'>
        {roles.length === 0 ? (
          <p className='pad'>There are currently no roles</p>
        ) : (
          <div className='flex flex-wrap gap-4 p-4 overflow-auto w-full'>
            {roles.map(({ name, roleMain }, idx) => {
              return (
                <div key={idx} style={{ minWidth: '250px', flex: '1 1 250px' }}>
                  <Card
                    title={<span>Role #{name}</span>}
                    content={
                      <div className='wrapper p-4 gap-2'>{roleMain}</div>
                    }
                    controls={<RoleControls roleName={name} />}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
