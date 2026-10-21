/* File: src/modules/Pages/Bundle/ConversationCard.tsx
  displays the details of a conversation entry
*/
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CircleChevronLeftIcon } from 'lucide-react';
import { Conversation } from '>/contracts';
import { parseBundleFiles } from '>/services/utils';
import { fixMarkdown, toLocalTime } from '>/services/utils';
import { MarkdownComponents } from '>/modules';
import { MarkdownBlock } from './MarkdownBlock';

type ConversationCardProps = {
  entry: Conversation;
  initialOpen?: boolean;
};

export const ConversationCard = ({
  entry,
  initialOpen,
}: ConversationCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen ? true : false);

  const {
    filesJson,
    createdAt,
    summary,
    inputTokens,
    outputTokens,
    prompt,
    reasoning,
  } = entry;

  // -------------
  // No-Hooks Section
  // -------------
  const pathFiles = parseBundleFiles(filesJson);
  const entryTime = toLocalTime(createdAt);

  return (
    <div className='space-y-2 page-section'>
      <h3
        className='page-bundle-heading cursor-pointer flex flex-row items-center justify-between select-none'
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className='truncate'>{`${entryTime}: ${summary}`}</span>

        <CircleChevronLeftIcon
          size={20}
          className={`shrink-0 icon-muted transition-transform duration-300 ${
            isOpen ? '-rotate-90' : ''
          }`}
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

          {pathFiles.length > 1 && (
            <h4 className='wrapper pt-4'>{`LLM Files: ${pathFiles.length}`}</h4>
          )}

          {pathFiles.map((file, idx) => (
            <MarkdownBlock
              key={`${file.path}-${idx}`}
              file={file}
              idx={idx}
              totalFilesCount={pathFiles.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};
