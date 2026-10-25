import { useGetRoleList } from '>/services/queryHooks';
import { ScreenLoader, ListingPageHeader, Card } from '>/modules';
import { RoleControls, RoleListHeader } from './RoleControls';

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
          <div className='flex flex-wrap gap-4 p-3 overflow-auto w-full'>
            {roles.map(({ name, roleMain }, idx) => {
              return (
                <div
                  className='wrapper border rounded-lg overflow-hidden'
                  key={idx}
                  style={{ minWidth: '250px', flex: '1 1 250px' }}
                >
                  <Card
                    title={`#${name}`}
                    content={roleMain}
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
