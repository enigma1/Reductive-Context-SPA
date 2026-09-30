import { useNavigate, useLocation } from 'react-router';
import { ListRestartIcon, FolderDotIcon } from 'lucide-react';
import { useGetPaths } from '>/services/queryHooks';
import { useCodeStore, dialogStoreActions } from '>/services/stores';
import { ScreenLoader, dialogFactories } from '>/modules';
import { FileSelector } from './FileSelector';

export const PathsView = () => {
  const { currentPaths } = useCodeStore(({ state }) => ({
    currentPaths: state.currentPaths,
  }));

  const { paths, isFetching, refetch } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      paths: state.paths,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const onRefresh = () => {
    refetch();
  };

  const setFilePaths = () => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setFilePaths(),
    });
  };

  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }

  const hasPaths = Object.values(paths).length > 0;

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='page-title'>Paths View</div>
          <div className='page-actions'>
            <button
              className='btn-secondary'
              onClick={onRefresh}
              title='Refresh Paths'
              disabled={!hasPaths}
            >
              <ListRestartIcon size={24} />
            </button>
            <button className='btn' onClick={setFilePaths} title='Set Paths'>
              <FolderDotIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className='page-content'>
        <div className='page-section'>
          {hasPaths ? (
            <>
              <p>
                Along with he prmopt, select the files to create a bundle, from
                the list below. You can also select lines of code from each
                selected file
              </p>
              <FileSelector filesByFolder={paths} />
            </>
          ) : (
            <p>
              Currently there are no paths defined to fetch files from. Click{' '}
              <button className='btn-micro inline' onClick={setFilePaths}>
                Set Paths
              </button>{' '}
              to add one or more paths.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
