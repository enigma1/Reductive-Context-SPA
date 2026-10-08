import { useRef, useMemo } from 'react';
import { useGetBundleList } from '>/services/queryHooks';
import { createContextTableStore } from '>/services/stores';
import {
  ScreenLoader,
  TableContainer,
  PageHeader,
  EffectiveTableWrapper,
} from '>/modules';
import { JsonArray } from '>/types';

export const BundleList = () => {
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const { tableStore } = useMemo(() => {
    const store = createContextTableStore();
    return {
      tableStore: store,
    };
  }, []);

  const { rows, columnsOrder, isFetching } = useGetBundleList(
    undefined,
    ({ state, query }) => ({
      rows: state.rows,
      columnsOrder: state.columnsOrder,
      isFetching: query.isFetching,
    }),
  );

  const viewRows = rows.map((row, idx) => {
    return {
      row: row as JsonArray,
      offset: idx,
    };
  });

  const isBusy = isFetching;
  return (
    <>
      {isBusy && <ScreenLoader />}
      <PageHeader store={tableStore} title='Stored Bundles' />
      <EffectiveTableWrapper
        outerRef={outerRef}
        resizeLineRef={resizeLineRef}
        tableRef={tableRef}
      >
        <TableContainer
          rows={viewRows}
          columnsOrder={columnsOrder}
          store={tableStore}
          outerRef={outerRef}
          tableRef={tableRef}
          resizeLineRef={resizeLineRef}
        />
      </EffectiveTableWrapper>
    </>
  );
};
