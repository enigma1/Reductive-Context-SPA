import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CircleChevronLeftIcon } from 'lucide-react';

import { RecommendedFile, Conversation } from '>/contracts';
import { toLocalTime, getLanguageFromFilename } from '>/services/utils';
import { CodeBlock } from '>/modules';

const parseFiles = (filesJson: string): RecommendedFile[] => {
  try {
    const parsed: unknown = JSON.parse(filesJson);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (file): file is RecommendedFile =>
        typeof file === 'object' &&
        file !== null &&
        typeof file.path === 'string' &&
        typeof file.content === 'string',
    );
  } catch {
    return [];
  }
};

type ConversationCardProps = {
  entry: Conversation;
};

export const ConversationCard = ({ entry }: ConversationCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    filesJson,
    createdAt,
    summary,
    inputTokens,
    outputTokens,
    prompt,
    reasoning,
  } = entry;

  const pathFiles = parseFiles(filesJson);
  const entryTime = toLocalTime(createdAt);

  return (
    <div className='space-y-2 page-section'>
      <h3
        className='page-bundle-heading cursor-pointer flex flex-row items-center justify-between select-none'
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className='truncate'>{`Entry on ${entryTime}: ${summary}`}</span>

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
            <ReactMarkdown components={{ code: CodeBlock }}>
              {prompt}
            </ReactMarkdown>
          </div>

          <div className='page-bundle-entry'>
            <h4 className='wrapper'>LLM Summary:</h4>
            <ReactMarkdown components={{ code: CodeBlock }}>
              {summary}
            </ReactMarkdown>
          </div>

          <div className='page-bundle-entry'>
            <h4 className='wrapper'>LLM Reasoning:</h4>
            <ReactMarkdown components={{ code: CodeBlock }}>
              {reasoning}
            </ReactMarkdown>
          </div>

          {pathFiles.length > 0 && (
            <h4 className='wrapper pt-4'>
              {`Files sent: ${pathFiles.length}`}
            </h4>
          )}

          {pathFiles.map((file, fileIndex) => {
            const language = getLanguageFromFilename({
              filePath: file.path,
              view: 'markdown',
            });

            return (
              <section key={`${file.path}-${fileIndex}`} className='max-w-none'>
                <h4 className='wrapper py-2'>
                  {`${fileIndex + 1}. ${file.path}`}
                </h4>

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
      )}
    </div>
  );
};
