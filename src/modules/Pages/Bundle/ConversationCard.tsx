/* File: src/modules/Pages/Bundle/ConversationCard.tsx
  displays the details of a conversation entry
*/
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CircleChevronLeftIcon, ScaleIcon, CopyIcon } from 'lucide-react';
import { Conversation, RecommendedFile } from '>/contracts';
import { cx, parseBundleFiles } from '>/services/utils';
import {
  fixMarkdown,
  toLocalTime,
  getLanguageFromFilename,
} from '>/services/utils';
import { dialogStoreActions } from '>/services/stores';
import { CodeBlock, MarkdownComponents, dialogFactories } from '>/modules';

type ConversationCardProps = {
  entry: Conversation;
};

export const ConversationCard = ({ entry }: ConversationCardProps) => {
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    filesJson,
    createdAt,
    summary,
    inputTokens,
    outputTokens,
    prompt,
    reasoning,
  } = entry;

  // ----------------
  // No-Hooks Section
  // ----------------
  const pathFiles = parseBundleFiles(filesJson);
  const entryTime = toLocalTime(createdAt);

  const onCopy = (content: string, idx: number) => {
    setFlashIndex(idx);
    navigator.clipboard.writeText(content);
  };

  const onContentCompare = (file: RecommendedFile) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.contentDifferences({ file }),
    });
  };

  return (
    <div className='space-y-2 page-section'>
      <h3
        className='page-bundle-heading cursor-pointer flex flex-row items-center justify-between select-none'
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className='truncate'>{`${entryTime}: ${summary}`}</span>

        <CircleChevronLeftIcon
          size={24}
          className={isOpen ? '-rotate-90' : ''}
        />
      </h3>

      {isOpen && (
        <div className='space-y-2 pt-2'>
          <div className='wrapper page-bundle-details'>
            <span>User Input Tokens: {inputTokens}</span>
            <span>LLM Output Tokens: {outputTokens}</span>
            <span>Created On: {entryTime}</span>
          </div>

          <div className='page-bundle-entry'>
            <h4 className='wrapper'>User Prompt:</h4>
            <ReactMarkdown components={MarkdownComponents}>
              {fixMarkdown(prompt)}
            </ReactMarkdown>
          </div>

          <div className='page-bundle-entry'>
            <h4 className='wrapper'>LLM Summary:</h4>
            <ReactMarkdown components={MarkdownComponents}>
              {fixMarkdown(summary)}
            </ReactMarkdown>
          </div>

          <div className='page-bundle-entry'>
            <h4 className='wrapper'>LLM Reasoning:</h4>
            <ReactMarkdown components={MarkdownComponents}>
              {fixMarkdown(reasoning)}
            </ReactMarkdown>
          </div>

          {pathFiles.length > 0 && (
            <h4 className='wrapper pt-4'>
              {`Files sent: ${pathFiles.length}`}
            </h4>
          )}

          {pathFiles.map((file, idx) => {
            const language = getLanguageFromFilename({
              filePath: file.path,
              view: 'markdown',
            });

            return (
              <section key={`${file.path}-${idx}`} className='max-w-none'>
                <div className='one-line'>
                  <h4 className='wrapper py-2'>{`${idx + 1}. ${file.path}`}</h4>
                  <button
                    className='btn-square'
                    onClick={() => onCopy(file.content, idx)}
                  >
                    <CopyIcon size={18} />
                  </button>
                  {!file.isNew && (
                    <button
                      className='btn-square'
                      onClick={() => onContentCompare(file)}
                    >
                      <ScaleIcon size={18} />
                    </button>
                  )}
                </div>
                <ReactMarkdown
                  components={{
                    code: ({
                      node,
                      className: cName,
                      children,
                      ...props
                    }: any) => {
                      const match = /language-(\w+)/.exec(cName || '');
                      const isBlock =
                        !!match ||
                        node?.position?.start?.line !==
                          node?.position?.end?.line;

                      if (isBlock) {
                        return (
                          <CodeBlock
                            {...props}
                            language={language}
                            wrapClasses={cx(
                              'page-border',
                              flashIndex === idx && 'content-flash',
                            )}
                            className={cName}
                            onAnimationEnd={() => setFlashIndex(null)}
                          >
                            {children}
                          </CodeBlock>
                        );
                      }

                      return <code className={cName}>{children}</code>;
                    },
                  }}
                >
                  {fixMarkdown(`\`\`\`${language}\n${file.content}\n\`\`\``)}
                </ReactMarkdown>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
