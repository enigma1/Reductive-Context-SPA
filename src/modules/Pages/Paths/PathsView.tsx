import { useNavigate } from 'react-router';
import { ListRestartIcon, FolderDotIcon, CirclePileIcon } from 'lucide-react';
import { useGetPaths, useCreateBundle } from '>/services/queryHooks';
import {
  useCodeStore,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import { routes } from '>/config';
import { ScreenLoader, dialogFactories } from '>/modules';
import type {
  FileNode,
  CreateBundleRequest,
  CreateBundleResponse,
} from '>/contracts';
import { FileSelector } from './FileSelector';

export const PathsView = () => {
  const navigate = useNavigate();

  const {
    currentPaths,
    selectedFiles,
    getSelectedFiles,
    setActiveBundleId,
    getActivePrompt,
  } = useCodeStore(({ state, api }) => ({
    selectedFiles: state.selectedFiles,
    currentPaths: state.activePaths,
    getSelectedFiles: api.getAllSelectedFiles,
    setActiveBundleId: api.setActiveBundleId,
    getActivePrompt: api.getActivePrompt,
  }));

  const { paths, isFetching, refetch } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      paths: state.paths,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { mutate } = useCreateBundle(({ api }) => ({
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
    onSuccess: (data: CreateBundleResponse) => {
      if (data.ok) {
        setActiveBundleId(data.bundleId);
        navigate(routes.front.bundleView);
      } else {
        setActiveBundleId(undefined);
        // Show error dialog
      }
    },
    onError: () => {
      setActiveBundleId();
      messageStoreActions.addMessage({
        content: {
          text: 'Bundle Creation failed. Please check endpoint and try again.',
          duration: 8000,
        },
      });
    },
  };

  const onCreateBundle = () => {
    const prompt = getActivePrompt();
    mutate({ paths: getSelectedFiles(), prompt }, callbacks);
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
              onClick={onCreateBundle}
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
