import { ListRestartIcon, FolderDotIcon, CirclePileIcon } from 'lucide-react';
import { useGetPaths, useBundleData } from '>/services/queryHooks';
import { useCodeStore, dialogStoreActions } from '>/services/stores';
import { ScreenLoader, dialogFactories } from '>/modules';
import type { BundleDataRequest } from '>/contracts';
import { FileSelector } from './FileSelector';

export const PathsView = () => {
  const { currentPaths, selectedFiles, getSelectedFiles } = useCodeStore(
    ({ state, api }) => ({
      selectedFiles: state.selectedFiles,
      currentPaths: state.currentPaths,
      getSelectedFiles: api.getAllSelectedFiles,
    }),
  );

  const { paths, isFetching, refetch } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      paths: state.paths,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { mutate } = useBundleData(({ api }) => ({
    mutate: api.mutate,
  }));

  const onBundleData = () => {
    const paths = getSelectedFiles().reduce<BundleDataRequest['paths']>(
      (filesByPath, file) => ({
        ...filesByPath,
        [file.path]: [...(filesByPath[file.path] ?? []), file.name],
      }),
      {},
    );

    mutate({ paths });
  };

  const onRefresh = () => {
    refetch();
  };

  const onSetFilePaths = () => {
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
              className='btn'
              onClick={onBundleData}
              title='Request a bundle from the given selected bundles'
              data-status={selectedFiles.length === 0 ? 'disabled' : undefined}
            >
              <CirclePileIcon size={24} />
            </button>

            <button
              className='btn-secondary'
              onClick={onRefresh}
              title='Refresh Paths'
              disabled={!hasPaths}
            >
              <ListRestartIcon size={24} />
            </button>
            <button className='btn' onClick={onSetFilePaths} title='Set Paths'>
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
              <button className='btn-micro inline' onClick={onSetFilePaths}>
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
