import { ListRestartIcon } from 'lucide-react';
import { cx } from '>/services/utils';
import { useGetPaths } from '>/services/queryHooks';
import { useCodeStore, useDialogStore } from '>/services/stores';
import { DialogContent, ErrorDetails, ScreenLoader } from '>/modules';

export const TextTree = () => {
  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  const { currentPaths } = useCodeStore(({ state }) => ({
    currentPaths: state.activePaths,
  }));

  const { isPathFetching, refetch, textTrees } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      textTrees: state.textTrees,
      isPathFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isPathFetching;
  if (isBusy) return <ScreenLoader />;

  const handleError = () => {
    clearError();
  };

  return (
    <div className='area-container'>
      {errorResponse && (
        <div className='animate-top-slide overflow-hidden border-b border-t'>
          <DialogContent
            className='animate-in zoom-in-95 duration-300'
            classSpacer='caption error'
            note='Fetching Paths failed'
            onClose={handleError}
          >
            <ErrorDetails error={errorResponse} />
          </DialogContent>
        </div>
      )}
      <div
        className={cx(
          'wrapper max min-h-0 transition-all duration-300',
          errorResponse && 'opacity-40 pointer-events-none',
        )}
      >
        <div className='area-spacer'>
          <h1 className='area-title'>{`Path Trees: ${Object.keys(textTrees).length}`}</h1>
          <div className='area-actions'>
            <div className='btn-group'>
              <button
                type='button'
                className='btn-secondary'
                onClick={() => refetch()}
                title='Refetch Path Trees'
              >
                <ListRestartIcon size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className='area-listing space-y-1'>
          {Object.entries(textTrees).map(([root, tree], idx) => {
            return (
              <div
                className='area-item p-0 sticky-container'
                key={`tree-${idx}`}
              >
                <span className='stand head px-2 py-1'>{`${idx + 1}. ${root}`}</span>
                <div className='pl-2'>
                  <pre className='whitespace-pre-wrap overflow-x-auto'>
                    {tree}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
