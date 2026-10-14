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
  const { conversationMode } = useConfigStore(({ state }) => ({
    conversationMode: state.conversationMode,
  }));

  const {
    bundleId = 0,
    activePrompt,
    getCurrentPaths,
  } = useCodeStore(({ state, api }) => ({
    bundleId: state.activeBundleId,
    bundleStream: state.bundleStream,
    setBundleStream: api.setBundleStream,
    activePrompt: state.activePrompt,
    getCurrentPaths: api.getCurrentPaths,
  }));

  const { bundleContent, conversations, isFetching, refetch } = useGetBundle(
    { bundleId: bundleId },
    ({ state, query }) => ({
      bundleContent: state.bundleContent,
      conversations: state.conversations,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

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

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isSetting || isSubmitting;

  if (isBusy) {
    return <ScreenLoader />;
  }

  const onGoBack = () => {
    const paths = getCurrentPaths();
    const dest =
      paths.length > 0 ? routes.front.pathsView : routes.front.bundleList;
    navigate(dest);
  };

  const pageTitle = `Viewing Bundle [${bundleId}] in ${conversationMode} mode ${conversationMode === 'listing' ? 'Entries [' + conversations.length + ']' : ''}`;
  const isDirty = isPromptDirty || isContentDirty;
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
