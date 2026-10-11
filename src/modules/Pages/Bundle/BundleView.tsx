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
import { SetBundleResponse, SubmitBundleResponse } from '>/contracts';

export const BundleView = () => {
  const navigate = useNavigate();
  const {
    bundleId = 0,
    bundleStream,
    activePrompt,
    setBundleStream,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    bundleStream: state.bundleStream,
    setBundleStream: api.setBundleStream,
    activePrompt: state.activePrompt,
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
      } else {
        messageStoreActions.addMessage({
          content: {
            text: 'Submitting the bundle caused a problem',
            duration: 5000,
          },
        });
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
    onSuccess: () => {
      if (bundleStream === 'processing') {
        setBundleStream('done');
      }
    },
    onError: () => {
      if (bundleStream === 'processing') {
        setBundleStream('error');
      }
      messageStoreActions.addMessage({
        content: {
          text: 'Processing the Bundle failed',
          duration: 5000,
        },
      });
    },
  };

  const onSubmitBundle = () => {
    setBundleStream('processing');
    submitBundle(
      { bundleId, bundleContent, prompt: activePrompt },
      submitCallbacks,
    );
    navigate(routes.front.bundleAnswer, { replace: true });
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
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: true,
            domReadOnly: false,
            copyWithSyntaxHighlighting: true,
            accessibilitySupport: 'on',
            occurrencesHighlight: 'off',
            glyphMargin: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            wordBasedSuggestions: 'off',
            folding: true,
            renderValidationDecorations: 'off',
          }}
        />
      </div>
    </>
  );
};
