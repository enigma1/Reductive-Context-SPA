import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayersPlusIcon,
  ListRestartIcon,
  FolderDotIcon,
  DatabasePlusIcon,
  ArrowLeftToLineIcon,
  BrushCleaningIcon,
  ChevronRightIcon,
  ChevronDownIcon,
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

const CollapsibleTextTree = ({
  root,
  textTree,
}: {
  root: string;
  textTree: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className='border border-base-300 rounded-md mb-2 overflow-hidden'>
      <div
        onClick={toggleExpand}
        className='flex items-center justify-between p-2 cursor-pointer bg-base-200 select-none'
      >
        <span className='stand'>{root}</span>
        <button
          className='btn-micro'
          type='button'
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronDownIcon size={18} />
          ) : (
            <ChevronRightIcon size={18} />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className='pl-2'>
          <pre className='whitespace-pre-wrap overflow-x-auto'>{textTree}</pre>
        </div>
      )}
    </div>
  );
};

export const PathsViewRoute = () => {
  const navigate = useNavigate();

  const {
    activeBundleId,
    activePrompt,
    currentPaths,
    selectedFiles,
    setActiveBundleId,
    getActivePrompt,
    clearSelectedFiles,
  } = useCodeStore(({ state, api }) => ({
    activeBundleId: state.activeBundleId,
    activePrompt: state.activePrompt,
    currentPaths: state.activePaths,
    selectedFiles: state.selectedFiles,
    setActiveBundleId: api.setActiveBundleId,
    clearSelectedFiles: api.clearSelectedFiles,
    getActivePrompt: api.getActivePrompt,
  }));

  const { paths, isPathFetching, refetch, textTrees } = useGetPaths(
    { paths: currentPaths },
    ({ state, query }) => ({
      paths: state.paths,
      unresolved: state.unresolved,
      textTrees: state.textTrees,
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
      { rootPaths: currentPaths, paths: selectedFiles, prompt },
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
        paths: selectedFiles,
        prompt,
      },
      callbacks,
    );
  };

  const onGoBack = () => {
    navigate(routes.front.bundleList);
  };

  const onRefresh = () => {
    refetch();
  };

  const onSetFilePaths = () => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.setFilePaths(),
    });
  };

  const hasPaths = currentPaths.length > 0 && Object.keys(paths).length > 0;

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='inline-wrapper'>
            <button
              className='btn-micro'
              title='Back to the Bundles List'
              onClick={onGoBack}
            >
              <ArrowLeftToLineIcon size={18} />
            </button>
            <div className='page-title'>{`Paths View ${activeBundleId ? 'for bundle ' + activeBundleId : '(New Bundle)'}`}</div>
          </div>
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
            <button
              className='btn'
              onClick={clearSelectedFiles}
              title='Clear Currently Selected Files'
              disabled={selectedFiles.length === 0}
            >
              <BrushCleaningIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className='page-content'>
        <div className='page-section'>
          {hasPaths ? (
            <>
              <div>
                {Object.entries(textTrees).map(([root, textTree], idx) => {
                  return (
                    <CollapsibleTextTree
                      key={`text-tree-${idx}`}
                      root={root}
                      textTree={textTree}
                    />
                  );
                })}
              </div>
              <FileSelector filesByFolder={paths} />
            </>
          ) : (
            <p>
              Currently there are no valid paths defined to fetch files from.
              Click{' '}
              <button className='btn-micro inline' onClick={onSetFilePaths}>
                Set Paths
              </button>{' '}
              to add one or more paths. Or click the clear selected paths to
              remove older invalid paths.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
