/* File src/modules/Flow/FlowCardView.tsx
  Card Component with tile-like layout of workflows
*/
import { ListingPageHeader, Card, ListingMode } from '>/modules';
import { FlowControls } from './FlowControls';
import { JsonArray } from '>/types';

type FlowCardViewProps = {
  onRefetch: () => void;
  getColumnValues: (columnsOrder: string[]) => JsonArray[];
};

export const FlowCardView = ({
  onRefetch,
  getColumnValues,
}: FlowCardViewProps) => {
  const dataInfo = ['flowName', 'flowIcon', 'status'];
  const statusIndex = dataInfo.findIndex((c) => c === 'status');
  const services = getColumnValues(dataInfo).filter(
    (item) => item[statusIndex] === 1,
  );
  return (
    <>
      <ListingPageHeader
        title="Workflows"
        actions={<ListingMode onRefresh={onRefetch} />}
      />
      <div className="page-content">
        {services.length === 0 ? (
          <p className="pad">There are currently no Workflows</p>
        ) : (
          <div className="flex flex-wrap gap-4 p-3 overflow-auto w-full">
            {services
              .filter((s) => s[statusIndex] === 1)
              .map(([flowName, flowIcon], idx) => {
                return (
                  <div
                    className="wrapper border rounded-lg overflow-hidden"
                    key={idx}
                    style={{ minWidth: '250px', flex: '1 1 250px' }}
                  >
                    <Card
                      title={`#${flowName}`}
                      content={flowName as string}
                      controls={<FlowControls flowName={flowName as string} />}
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
