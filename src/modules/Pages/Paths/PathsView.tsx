import { useNavigate } from 'react-router';
import { ListRestartIcon, FolderDotIcon, CirclePileIcon } from 'lucide-react';
import { useGetPaths, useBundleData } from '>/services/queryHooks';
import {
  useCodeStore,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import { routes } from '>/config';
import { ScreenLoader, dialogFactories } from '>/modules';
import type { BundleDataRequest, BundleDataResponse } from '>/contracts';
import { FileSelector } from './FileSelector';

export const PathsView = () => {
  const navigate = useNavigate();

  const { currentPaths, selectedFiles, getSelectedFiles, setActiveBundleId } =
    useCodeStore(({ state, api }) => ({
      selectedFiles: state.selectedFiles,
      currentPaths: state.activePaths,
      getSelectedFiles: api.getAllSelectedFiles,
      setActiveBundleId: api.setActiveBundleId,
    }));

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

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }

  const callbacks = {
    onSuccess: (data: BundleDataResponse) => {
      if (data.ok) {
        setActiveBundleId(data.bundleId);
        navigate(routes.front.bundleView, { replace: true });
      } else {
        setActiveBundleId(undefined);
        // Show error dialog
      }
    },
    onError: () => {
      setActiveBundleId();
      messageStoreActions.addMessage({
        content: {
          text: 'Login failed. Please check endpoint and your credentials and try again.',
          duration: 8000,
        },
      });
    },
  };

  const onBundleData = () => {
    const paths = getSelectedFiles().reduce<BundleDataRequest['paths']>(
      (filesByPath, file) => ({
        ...filesByPath,
        [file.path]: [...(filesByPath[file.path] ?? []), file.name],
      }),
      {},
    );
    mutate({ paths }, callbacks);
  };

  const onRefresh = () => {
    refetch();
  };

  const onSetFilePaths = () => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setFilePaths(),
    });
  };

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
