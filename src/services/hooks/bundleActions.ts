import { useSubmitBundle } from '>/services/queryHooks';
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

  const onSubmitBundle = () => {
    setBundleStream('processing');
    submitBundle(
      {
        bundleId,
        bundleContent: contentEditor.getContent(),
        prompt: promptEditor.getContent(),
      },
      {
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
      },
    );
  };

  return {
    onSubmitBundle,
    isSubmitting,

    onPromptMount: promptEditor.onMount,
    isPromptDirty: promptEditor.isDirty,
    onContentMount: contentEditor.onMount,
    isContentDirty: contentEditor.isDirty,
  };
};
