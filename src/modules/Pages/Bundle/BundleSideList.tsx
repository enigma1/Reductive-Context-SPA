import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';

export const BundleSideList = () => {
  const { rows, columnsOrder, isFetching, refetch } = useGetBundleList(
    undefined,
    ({ state, query }) => ({
      rows: state.rows,
      columnsOrder: state.columnsOrder,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );
  return null;
};
