import { ListingPageHeader, Card, ListingMode } from '>/modules';
import { RoleControls } from './RoleControls';
import { JsonArray } from '>/types';

type RoleCardViewProps = {
  onRefetch: () => void;
  getColumnValues: (columnsOrder: string[]) => JsonArray[];
};

export const RoleCardView = ({
  onRefetch,
  getColumnValues,
}: RoleCardViewProps) => {
  const dataInfo = ['roleName', 'roleMain', 'roleIcon', 'status'];
  const statusIndex = dataInfo.findIndex((c) => c === 'status');
  const services = getColumnValues(dataInfo).filter(
    (item) => item[statusIndex] === 1,
  );
  return (
    <>
      <ListingPageHeader
        title="Roles"
        actions={<ListingMode onRefresh={onRefetch} />}
      />
      <div className="page-content">
        {services.length === 0 ? (
          <p className="pad">There are currently no Roles</p>
        ) : (
          <div className="flex flex-wrap gap-4 p-3 overflow-auto w-full">
            {services
              .filter((s) => s[statusIndex] === 1)
              .map(([roleName, roleMain, roleIcon], idx) => {
                return (
                  <div
                    className="wrapper border rounded-lg overflow-hidden"
                    key={idx}
                    style={{ minWidth: '250px', flex: '1 1 250px' }}
                  >
                    <Card
                      title={`#${roleName}`}
                      content={roleMain as string}
                      controls={<RoleControls roleName={roleName as string} />}
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
