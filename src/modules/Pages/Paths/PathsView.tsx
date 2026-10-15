import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayersPlusIcon,
  ListRestartIcon,
  FolderDotIcon,
  DatabasePlusIcon,
} from 'lucide-react';
import {
  useGetPaths,
  useCreateBundle,
  useSetBundle,
  useGetBundle,
} from '>/services/queryHooks';
import {
  useCodeStore,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import { routes } from '>/config';
import { ScreenLoader, dialogFactories } from '>/modules';
import type { CreateBundleResponse } from '>/contracts';
import { FileSelector } from './FileSelector';

export const PathsView = () => {
  const navigate = useNavigate();

  const {
    activeBundleId,
    activePrompt,
    currentPaths,
    getSelectedFiles,
    setActiveBundleId,
    getActivePrompt,
  } = useCodeStore(({ state, api }) => ({
    activeBundleId: state.activeBundleId,
    activePrompt: state.activePrompt,
    currentPaths: state.activePaths,
    getSelectedFiles: api.getAllSelectedFiles,
    setActiveBundleId: api.setActiveBundleId,
    getActivePrompt: api.getActivePrompt,
  }));

  const { paths, isPathFetching, refetch } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      paths: state.paths,
      isPathFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { mutateCreate, isCreatePending } = useCreateBundle(
    ({ api, query }) => ({
      mutateCreate: api.mutate,
      isCreatePending: query.isPending,
    }),
  );

  const { mutateSet, isSetPending } = useSetBundle(({ api, query }) => ({
    mutateSet: api.mutate,
    isSetPending: query.isPending,
  }));

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isPathFetching || isCreatePending || isSetPending;
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
          text: 'Bundle failed. Please check endpoint and try again.',
          duration: 8000,
        },
      });
    },
  };

  const onCreateBundle = () => {
    const prompt = getActivePrompt();
    mutateCreate(
      { rootPaths: currentPaths, paths: getSelectedFiles(), prompt },
      callbacks,
    );
  };

  const onSetBundle = () => {
    if (!activeBundleId) return;
    const prompt = getActivePrompt();
    mutateSet(
      {
        bundleId: activeBundleId,
        rootPaths: currentPaths,
        paths: getSelectedFiles(),
        prompt,
      },
      callbacks,
    );
  };

  const onRefresh = () => {
    refetch();
  };

  const onSetFilePaths = () => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setFilePaths(),
    });
  };

  const hasPaths = currentPaths.length > 0;

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='page-title'>{`Paths View ${activeBundleId ? 'for bundle ' + activeBundleId : '(New Bundle)'}`}</div>
          <div className='page-actions'>
            {activeBundleId ? (
              <button
                className='btn'
                onClick={activeBundleId ? onSetBundle : onCreateBundle}
                title={`Update Bundle ${activeBundleId}`}
                data-status={activePrompt.length < 10 ? 'disabled' : undefined}
              >
                <LayersPlusIcon size={24} />
              </button>
            ) : (
              <button
                className='btn'
                onClick={onCreateBundle}
                title={'Create a new bundle'}
                data-status={activePrompt.length < 10 ? 'disabled' : undefined}
              >
                <DatabasePlusIcon size={24} />
              </button>
            )}

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
                Enter the prmopt and select the files to create a bundle. You
                can also select multiple sets of lines of code by viewing each
                selected file.
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
