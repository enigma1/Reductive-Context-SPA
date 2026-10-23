import { useNavigate, useLocation } from 'react-router';
import { FileXIcon } from 'lucide-react';
import { routes } from '>/config';
import { useCodeStore, dialogStoreActions } from '>/services/stores';
import { useGetBundleList, useDeleteBundles } from '>/services/queryHooks';
import { ScreenLoader, dialogFactories } from '>/modules';
import { BUNDLE_ID, BUNDLE_PROMPT } from '>/config';

export const BundleSideList = () => {
  const { rows, isFetching, refetch, getBundleNames, getBundleFields } =
    useGetBundleList(undefined, ({ state, query, api }) => ({
      rows: state.rows,
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
  const isBusy = isFetching || isPending;
  const navigate = useNavigate();
  const location = useLocation();
  const names = getBundleNames();
  const fieldEntries = getBundleFields();

  const onDeleteBundle = (idx: number) => {
    const bundleId = fieldEntries[idx].bundleId;
    const columnsOrder = [BUNDLE_ID, BUNDLE_PROMPT];
    const rows = [[bundleId, names[idx]]];

    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ bundleIds: [bundleId] });
      if (location.pathname !== routes.front.bundleList)
        navigate(routes.front.bundleList);
    };

    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };

  return (
    <div className='relative'>
      {isBusy && <ScreenLoader />}
      <div className='side-list'>
        {rows.length > 0 ? (
          <>
            {rows.map((row, idx) => {
              const entry = fieldEntries[idx];
              const isSelected = activeBundleId === entry.bundleId;
              return (
                <div
                  className='btn-group side-list-item min-w-0 gap-0.5'
                  key={`${row}-${idx}`}
                >
                  <button
                    className='btn-square border-0 error shrink-0 px-1'
                    onClick={() => onDeleteBundle(idx)}
                  >
                    <FileXIcon size={16} />
                  </button>
                  <button
                    className='truncate min-w-0 flex-1 text-left'
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
