import { ListingPageHeader, Card, ListingMode } from '>/modules';
import type { McpTransports } from '>/contracts';
import { McpControls } from './McpControls';
import { JsonTypes, JsonArray } from '>/types';

type McpCardViewProps = {
  onRefetch: () => void;
  getColumnValues: (columnsOrder: string[]) => JsonArray[];
};

export const McpCardView = ({
  onRefetch,
  getColumnValues,
}: McpCardViewProps) => {
  const dataInfo = ['mcpName', 'mcpTransport', 'mcpIcon', 'status'];
  const statusIndex = dataInfo.findIndex((c) => c === 'status');
  const services = getColumnValues(dataInfo).filter(
    (item) => item[statusIndex] === 1,
  );
  return (
    <>
      <ListingPageHeader
        title="MCP Services"
        actions={<ListingMode onRefresh={onRefetch} />}
      />
      <div className="page-content">
        {services.length === 0 ? (
          <p className="pad">There are currently no MCP services</p>
        ) : (
          <div className="flex flex-wrap gap-4 p-3 overflow-auto w-full">
            {services
              .filter((s) => s[statusIndex] === 1)
              .map(([mcpName, mcpTransport, mcpIcon], idx) => {
                return (
                  <div
                    className="wrapper border rounded-lg overflow-hidden"
                    key={idx}
                    style={{ minWidth: '250px', flex: '1 1 250px' }}
                  >
                    <Card
                      title={`#${mcpName}`}
                      content={mcpTransport as McpTransports}
                      controls={<McpControls mcpName={mcpName as string} />}
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
