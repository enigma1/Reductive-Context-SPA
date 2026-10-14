import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useConfigStore, useCodeStore } from '>/services/stores';
import { routes } from '>/config';
import { useBundleActions } from '>/services/hooks';
import { useGetBundle } from '>/services/queryHooks';
import { ScreenLoader, CustomPageHeader, CodeBlock } from '>/modules';
import { BundleEditors } from './BundleEditors';
import { ConversationEntries } from './ConversationEntries';
import { BundleHeader } from './BundleHeader';

export const BundleView = () => {
  const navigate = useNavigate();
  const { conversationMode, setConversationMode } = useConfigStore(
    ({ state, api }) => ({
      conversationMode: state.conversationMode,
      setConversationMode: api.setConversationMode,
    }),
  );

  const {
    bundleId = 0,
    activePrompt,
    setActivePrompt,
    getCurrentPaths,
    setCurrentPaths,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    bundleStream: state.bundleStream,
    setBundleStream: api.setBundleStream,
    activePrompt: state.activePrompt,
    setActivePrompt: api.setActivePrompt,
    getCurrentPaths: api.getCurrentPaths,
    setCurrentPaths: api.setCurrentPaths,
  }));

  const {
    prompt,
    rootPaths,
    bundleContent,
    conversations,
    isFetching,
    refetch,
  } = useGetBundle({ bundleId: bundleId }, ({ state, query }) => ({
    bundleContent: state.bundleContent,
    conversations: state.conversations,
    rootPaths: state.rootPaths,
    prompt: state.prompt,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }));

  const {
    onSubmitBundle,
    onSetBundle,
    onPromptMount,
    onContentMount,
    isSetting,
    isSubmitting,
    isPromptDirty,
    isContentDirty,
  } = useBundleActions();

  useEffect(() => {
    if (conversationMode === 'listing' && conversations.length === 0) {
      setConversationMode('initial');
    }
  }, [conversationMode, conversations]);
  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isSetting || isSubmitting;

  if (isBusy) {
    return <ScreenLoader />;
  }

  const onGoBack = () => {
    if (conversationMode === 'initial') {
      navigate(routes.front.pathsView);
      return;
    }
    if (conversationMode === 'listing') {
      setConversationMode('initial');
      return;
    }
    navigate(routes.front.bundleList);
  };

  const pageTitle = `Viewing Bundle [${bundleId}] in ${conversationMode} mode ${conversationMode === 'listing' ? 'Entries [' + conversations.length + ']' : ''}`;
  const isDirty = isPromptDirty || isContentDirty;
  const cMode = conversations.length > 0 ? conversationMode : 'listing';
  return (
    <>
      <CustomPageHeader
        title={pageTitle}
        onBack={onGoBack}
        actions={
          <BundleHeader
            hasConversations={conversations.length > 0}
            isDirty={isDirty}
            onSubmitBundle={() => {
              onSubmitBundle();
              navigate(routes.front.bundleAnswer, { replace: true });
            }}
            onSetBundle={onSetBundle}
            onRefresh={refetch}
          />
        }
      />

      <div className='page-content'>
        {conversationMode === 'initial' ? (
          <BundleEditors
            prompt={activePrompt}
            content={bundleContent}
            onPromptMount={onPromptMount}
            onContentMount={onContentMount}
          />
        ) : (
          <ConversationEntries
            conversations={conversations}
            bundleId={bundleId}
          />
        )}
      </div>
    </>
  );
};
