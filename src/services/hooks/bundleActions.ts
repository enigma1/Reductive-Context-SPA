import { useSetBundle, useSubmitBundle } from '>/services/queryHooks';
import { messageStoreActions, useCodeStore } from '>/services/stores';
import { SetBundleResponse } from '>/contracts';
import { useEditorBundle } from './editor';

export const useBundleActions = () => {
  const promptEditor = useEditorBundle();
  const contentEditor = useEditorBundle();

  const {
    bundleId = 0,
    activePrompt,
    bundleStream,
    setBundleStream,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    activePrompt: state.activePrompt,
    bundleStream: state.bundleStream,
    setBundleStream: api.setBundleStream,
  }));

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

  const onSetBundle = () => {
    setBundle(
      {
        bundleId,
        bundleContent: contentEditor.getContent(),
        prompt: activePrompt,
      },
      {
        onSuccess: (data: SetBundleResponse) => {
          if (!data.ok) {
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
      },
    );
  };

  const onSubmitBundle = () => {
    setBundleStream('processing');
    submitBundle(
      {
        bundleId,
        bundleContent: promptEditor.getContent(),
        prompt: activePrompt,
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
    onSetBundle,
    onSubmitBundle,
    isSetting,
    isSubmitting,

    onPromptMount: promptEditor.onMount,
    isPromptDirty: promptEditor.isDirty,
    onContentMount: contentEditor.onMount,
    isContentDirty: contentEditor.isDirty,
  };
};
