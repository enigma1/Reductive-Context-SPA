import { useState } from 'react';
import { useGetMcpList } from '>/services/queryHooks';
import { ScreenLoader, ListingPageHeader, Card } from '>/modules';
import { McpControls, McpListHeader } from './McpControls';

export const McpListRoute = () => {
  const { services, isFetching, refetch } = useGetMcpList(
    undefined,
    ({ state, query }) => ({
      services: state.services,
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
        title='MCP Services'
        actions={<McpListHeader {...headerActions} />}
      />
      <div className='page-content'>
        {services.length === 0 ? (
          <p className='pad'>There are currently no MCP services</p>
        ) : (
          <div className='flex flex-wrap gap-4 p-3 overflow-auto w-full'>
            {services.map(({ mcpName, mcpTransport }, idx) => {
              return (
                <div
                  className='wrapper border rounded-lg overflow-hidden'
                  key={idx}
                  style={{ minWidth: '250px', flex: '1 1 250px' }}
                >
                  <Card
                    title={`#${mcpName}`}
                    content={mcpTransport}
                    controls={<McpControls mcpName={mcpName} />}
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
