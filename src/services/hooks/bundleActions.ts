import { useSubmitBundle, useResumeBundle } from '>/services/queryHooks';
import {
  messageStoreActions,
  useCodeStore,
  configStoreActions,
} from '>/services/stores';
import { useEditor } from './editor';

export const useBundleActions = () => {
  const promptEditor = useEditor();
  const contentEditor = useEditor();

  const {
    bundleId = 0,
    bundleStream,
    textTrees,
    setBundleStream,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    activePrompt: state.activePrompt,
    bundleStream: state.bundleStream,
    textTrees: state.textTrees,
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

  const onSubmitBundle = () => {
    const processBundle =
      bundleStream === 'awaiting' ? resumeBundle : submitBundle;
    setBundleStream('processing');
    processBundle({
      role: configStoreActions.getCurrentRole(),
      bundleId,
      textTrees,
      bundleContent: contentEditor.getContent(),
      prompt: promptEditor.getContent(),
    });
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
