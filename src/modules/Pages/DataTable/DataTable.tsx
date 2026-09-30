import { useGetTableData } from '>/services/queryHooks';
import { MiniTable, ScreenLoader } from '>/modules';

export const DataTable = () => {
  const request = { table: 'test' };
  const { columnsOrder, rows, isFetching } = useGetTableData(
    request,
    ({ state, query }) => ({
      columnsOrder: state.columnsOrder,
      rows: state.rows,
      isSuccess: query.isSuccess,
      isFetching: query.isFetching,
    }),
  );
  const viewRows = rows.map((row, idx) => ({ offset: idx, row }));
  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }
  console.log('cols', columnsOrder, rows);
  return (
    <>
      <div className='page-heading'>
        <div className='page-spacer'>
          <div className='page-title'>Data Table Page</div>
        </div>
      </div>
      <div className='page-content'>
        <MiniTable rows={viewRows} columnsOrder={columnsOrder} />
      </div>
    </>
  );
};
