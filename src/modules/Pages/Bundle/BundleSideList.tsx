import { useNavigate, useLocation } from 'react-router';
import { routes } from '>/config';
import { useCodeStore } from '>/services/stores';
import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

export const BundleSideList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    rows,
    columnsOrder,
    isFetching,
    refetch,
    getBundleNames,
    getBundleFields,
  } = useGetBundleList(undefined, ({ state, query, api }) => ({
    rows: state.rows,
    columnsOrder: state.columnsOrder,
    isFetching: query.isFetching,
    refetch: query.refetch,
    getBundleNames: api.getBundleNames,
    getBundleFields: api.getBundleFields,
  }));

  const { activeBundleId, setActiveBundleId } = useCodeStore(
    ({ state, api }) => ({
      activeBundleId: state.activeBundleId,
      setActiveBundleId: api.setActiveBundleId,
    }),
  );

  const isBusy = isFetching;
  const names = getBundleNames();
  const fieldEntries = getBundleFields();

  return (
    <div className='relative'>
      {isBusy && <ScreenLoader local={true} />}
      <div className='side-list'>
        {rows.length > 0 ? (
          <>
            {rows.map((row, idx) => {
              const entry = fieldEntries[idx];
              const isSelected = activeBundleId === entry.bundleId;
              return (
                <button
                  key={`${row}-${idx}`}
                  className='side-list-item truncate'
                  data-active={isSelected}
                  onClick={() => {
                    setActiveBundleId(entry.bundleId);
                    navigate(routes.front.bundleView);
                  }}
                >
                  {names[idx]}
                </button>
              );
            })}
          </>
        ) : (
          <div className='side-list-empty'>No Conversation</div>
        )}
      </div>
    </div>
  );
};
