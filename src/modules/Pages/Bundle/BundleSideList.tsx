import { useNavigate, useLocation } from 'react-router';
import { FileXIcon } from 'lucide-react';
import { routes } from '>/config';

import { useCodeStore } from '>/services/stores';
import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

export const BundleSideList = () => {
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

  const { isPending, mutate } = useDeleteBundles(({ query, api }) => ({
    isPending: query.isPending,
    mutate: api.mutate,
  }));

  // ----------------
  // No-Hooks Section
  // ----------------
  const navigate = useNavigate();
  const location = useLocation();
  const names = getBundleNames();
  const fieldEntries = getBundleFields();

  const onDeleteBundle = (idx: number) => {
    const bundleId = fieldEntries[idx].bundleId;
    // mutate({ bundleIds: [bundleId] });
  };

  const isBusy = isFetching || isPending;

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
                <div className='btn-group side-list-item' key={`${row}-${idx}`}>
                  <button
                    className='btn-micro'
                    onClick={() => onDeleteBundle(idx)}
                  >
                    <FileXIcon size={16} />
                  </button>
                  <button
                    className='truncate'
                    data-active={isSelected}
                    onClick={() => {
                      setActiveBundleId(entry.bundleId);
                      navigate(routes.front.bundleView);
                    }}
                  >
                    {names[idx]}
                  </button>
                </div>
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
