import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import {
  ListRestartIcon,
  SavePlusIcon,
  FileSlidersIcon,
  ChevronsLeftRightEllipsisIcon,
} from 'lucide-react';
import {
  useConfigStore,
  useCodeStore,
  messageStoreActions,
} from '>/services/stores';
import { routes } from '>/config';
import { useEditorBundle } from '>/services/hooks';
import {
  useGetBundle,
  useSetBundle,
  useSubmitBundle,
} from '>/services/queryHooks';
import { ScreenLoader, CustomPageHeader, CodeBlock } from '>/modules';
import { SetBundleResponse, SubmitBundleResponse } from '>/contracts';
import { getLanguageFromFilename } from '>/services/utils';

type BundleFile = {
  path: string;
  content: string;
  isNew: boolean;
};

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
    bundleStream,
    activePrompt,
    setBundleStream,
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

  const { onMount, isDirty, getContent } = useEditorBundle();
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

  useEffect(() => {
    if (conversationMode === 'listing' && conversations.length === 0)
      setConversationMode('initial');
  }, [conversations, conversationMode]);
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
    setBundle({ bundleId, bundleContent: getContent() }, setCallbacks);
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
      { bundleId, bundleContent: getContent(), prompt: activePrompt },
      submitCallbacks,
    );
    navigate(routes.front.bundleAnswer, { replace: true });
  };

  const onGoBack = () => {
    const paths = getCurrentPaths();
    const dest =
      paths.length > 0 ? routes.front.pathsView : routes.front.bundleList;
    navigate(dest);
  };

  const onRefresh = () => {
    refetch();
  };

  const onSwitchConversationMode = () => {
    setConversationMode(
      conversationMode === 'listing' || conversations.length === 0
        ? 'initial'
        : 'listing',
    );
  };

  const parseFiles = (filesJson: string): BundleFile[] => {
    try {
      return JSON.parse(filesJson);
    } catch {
      return [];
    }
  };
  const isProcessingBundle = isSubmitting || isSetting;
  const firstActions = (
    <>
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
        data-status={!isDirty || isProcessingBundle ? 'disabled' : undefined}
      >
        <SavePlusIcon size={24} />
      </button>
    </>
  );

  const switchNote =
    conversationMode === 'listing'
      ? 'Switch To Conversation'
      : 'Switch to Original Prompt';

  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
      <button
        className='btn-secondary'
        onClick={onSwitchConversationMode}
        title={switchNote}
        data-status={conversations.length === 0 ? 'disabled' : undefined}
      >
        <ChevronsLeftRightEllipsisIcon size={24} />
      </button>
    </>
  );

  const actions =
    conversationMode === 'listing' ? (
      commonActions
    ) : (
      <>
        {firstActions}
        {commonActions}
      </>
    );

  return (
    <>
      <CustomPageHeader
        title={`Viewing Bundle in ${conversationMode} mode: ${bundleId}`}
        onBack={onGoBack}
        actions={actions}
      />
      <div className='page-content'>
        {conversationMode === 'initial' ? (
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
        ) : (
          conversations.map((entry, idx) => (
            <div
              className='space-y-2 page-section'
              key={`conversation-${entry.createdAt}-${bundleId}-${idx}`}
            >
              <div className='wrapper gap-1 text-sm'>
                <span>Input tokens: {entry.inputTokens}</span>
                <span>Output tokens: {entry.outputTokens}</span>
                <span>Created: {entry.createdAt}</span>
              </div>
              <div className='max-w-none'>
                <ReactMarkdown components={{ code: CodeBlock }}>
                  {entry.summary}
                </ReactMarkdown>
              </div>
              <div className='max-w-none'>
                <ReactMarkdown components={{ code: CodeBlock }}>
                  {entry.prompt}
                </ReactMarkdown>
              </div>
              <div className='max-w-none'>
                <ReactMarkdown components={{ code: CodeBlock }}>
                  {entry.reasoning}
                </ReactMarkdown>
              </div>
              {parseFiles(entry.filesJson).map((file, fileIndex) => {
                const language = getLanguageFromFilename({
                  filePath: file.path,
                  view: 'markdown',
                });

                return (
                  <section
                    key={`${file.path}-${fileIndex}`}
                    className='max-w-none'
                  >
                    <h4 className='wrapper py-2'>{file.path}</h4>

                    <ReactMarkdown
                      components={{
                        code: (props) => (
                          <CodeBlock
                            {...props}
                            language={language}
                            wrapClasses='page-border'
                          />
                        ),
                      }}
                    >
                      {`\`\`\`${language}\n${file.content}\n\`\`\``}
                    </ReactMarkdown>
                  </section>
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
};
