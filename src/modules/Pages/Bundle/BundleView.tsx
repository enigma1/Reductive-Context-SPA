import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import {
  ListRestartIcon,
  ArrowLeftToLineIcon,
  SavePlusIcon,
  FileSlidersIcon,
} from 'lucide-react';
import { useCodeStore, messageStoreActions } from '>/services/stores';
import { routes } from '>/config';
import { useEditorBundle } from '>/services/hooks';
import {
  useGetBundle,
  useSetBundle,
  useSubmitBundle,
} from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';
import { SetBundleResponse, SubmitBundleResponse } from '</src/contracts';

export const BundleView = () => {
  const navigate = useNavigate();
  const { bundleId = 0 } = useCodeStore(({ state }) => ({
    bundleId: state.activeBundleId,
  }));

  const { bundleContent, isFetching, refetch } = useGetBundle(
    { bundleId: bundleId },
    ({ state, query }) => ({
      bundleContent: state.bundleContent,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { onMount, isDirty } = useEditorBundle();
  const { mutate: setBundle, isPending: isSetting } = useSetBundle(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
  );

  const { mutate: submitBundle, isPending: isSubmitting } = useSubmitBundle(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
  );

  // effect for invalid bundle
  useEffect(() => {
    if (!isFetching && !bundleId) {
      navigate(routes.front.pathsView, { replace: true });
    }
  }, [bundleId, isFetching, navigate]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }

  const setCallbacks = {
    onSuccess: (data: SetBundleResponse) => {
      if (data.ok) {
        // navigate(routes.front.bundleView);
      } else {
        // Show error dialog
      }
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: 'Updating the bundle failed - Check if LLM is active',
          duration: 5000,
        },
      });
    },
  };

  const onSetBundle = () => {
    setBundle({ bundleId, bundleContent }, setCallbacks);
  };

  const submitCallbacks = {
    onSuccess: (data: SubmitBundleResponse) => {
      if (data.ok) {
        // navigate(routes.front.bundleView);
        messageStoreActions.addMessage({
          type: 'success',
          content: {
            text: 'Bundle In progress',
            duration: 5000,
          },
        });
      } else {
        // Show error dialog
      }
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: 'Processing the Bundle failed',
          duration: 5000,
        },
      });
    },
  };

  const onSubmitBundle = () => {
    submitBundle({ bundleId, bundleContent }, submitCallbacks);
  };

  const onGoBack = () => {
    navigate(routes.front.pathsView, { replace: true });
  };

  const onRefresh = () => {
    refetch();
  };

  const isProcessingBundle = isSubmitting || isSetting;

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='inline-wrapper'>
            <button
              className='btn-micro'
              title='Back to the File List'
              onClick={onGoBack}
            >
              <ArrowLeftToLineIcon size={18} />
            </button>
            <div className='page-title' title='Generated Bundle'>
              Viewing Bundle
            </div>
          </div>
          <div className='page-actions'>
            <button
              className='btn'
              onClick={onSubmitBundle}
              title='Submit Bundle'
              data-status={isProcessingBundle}
            >
              <FileSlidersIcon size={24} />
            </button>

            <button
              className='btn'
              onClick={onSetBundle}
              title='Update Bundle'
              data-status={
                !isDirty || isProcessingBundle ? 'disabled' : undefined
              }
            >
              <SavePlusIcon size={24} />
            </button>
            <button
              className='btn-secondary'
              onClick={onRefresh}
              title='Restore Bundle'
            >
              <ListRestartIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className='page-content'>
        <Editor
          onMount={onMount}
          value={bundleContent}
          language={'markdown'}
          theme='vs-dark'
          options={{
            domReadOnly: false,
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: true,
          }}
        />
      </div>
    </>
  );
};
