import { useSubmitBundle, useResumeBundle } from '>/services/queryHooks';
import { messageStoreActions, useCodeStore } from '>/services/stores';
import { useEditor } from './editor';

export const useBundleActions = () => {
  const promptEditor = useEditor();
  const contentEditor = useEditor();

  const {
    bundleId = 0,
    bundleStream,
    setBundleStream,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    activePrompt: state.activePrompt,
    bundleStream: state.bundleStream,
    setBundleStream: api.setBundleStream,
  }));

  const { mutate: submitBundle, isPending: isSubmitting } = useSubmitBundle(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
  );

  const { mutate: resumeBundle, isPending: isResuming } = useResumeBundle(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
  );

  const callbacks = {
    onSuccess: () => {
      if (bundleStream === 'awaiting') {
        setBundleStream('clarify');
        messageStoreActions.addMessage({
          content: {
            text: 'Provide addition information to continue',
            duration: 5000,
          },
        });
      }

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
          text: 'Bundle processing failed',
          duration: 5000,
        },
      });
    },
  };

  const onSubmitBundle = () => {
    const processBundle =
      bundleStream === 'clarify' ? resumeBundle : submitBundle;
    setBundleStream('processing');
    processBundle(
      {
        bundleId,
        bundleContent: contentEditor.getContent(),
        prompt: promptEditor.getContent(),
      },
      callbacks,
    );
  };

  return {
    onSubmitBundle,
    isSubmitting: isSubmitting || isResuming,
    onPromptMount: promptEditor.onMount,
    isPromptDirty: promptEditor.isDirty,
    onContentMount: contentEditor.onMount,
    isContentDirty: contentEditor.isDirty,
  };
};
