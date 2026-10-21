import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyIcon, CheckIcon, FilePlusIcon, ScaleIcon } from 'lucide-react';
import { RecommendedFile } from '>/contracts';
import { cx, fixMarkdown, getLanguageFromFilename } from '>/services/utils';
import { dialogStoreActions } from '>/services/stores';
import { dialogFactories, CodeBlock } from '>/modules';

type MarkdownBlockProps = {
  file: RecommendedFile;
  idx: number;
  totalFilesCount?: number;
};

export const MarkdownBlock = ({
  file,
  idx,
  totalFilesCount = 1,
}: MarkdownBlockProps) => {
  const [flashIndex, setFlashIndex] = useState<number | null>(null);

  const language = getLanguageFromFilename({
    filePath: file.path,
    view: 'markdown',
  });

  const path = `${file.path} ${file.isNew ? '(New File)' : ''}`;

  const onCopy = (content: string, index: number) => {
    setFlashIndex(index);
    navigator.clipboard.writeText(content);
    setTimeout(() => setFlashIndex(null), 2000);
  };

  const onWriteNew = (fileObj: RecommendedFile) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.writeFile({ file: fileObj }),
    });
  };

  const onContentCompare = (fileObj: RecommendedFile) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.contentDifferences({ file: fileObj }),
    });
  };

  return (
    <section
      key={`${file.path}-${idx}`}
      className='max-w-none page-section flex-1 p-0'
    >
      <div className='one-line mb-sep sub-heading-bg p-2'>
        <h4 className='wrapper'>{`${totalFilesCount > 1 ? idx + 1 + '. ' : ''}${path}`}</h4>
        <button
          className='btn-square'
          onClick={() => onCopy(file.content, idx)}
        >
          {flashIndex !== null ? (
            <CheckIcon size={18} />
          ) : (
            <CopyIcon size={18} />
          )}
        </button>
        {file.isNew ? (
          <button className='btn-square' onClick={() => onWriteNew(file)}>
            <FilePlusIcon size={18} />
          </button>
        ) : (
          <button className='btn-square' onClick={() => onContentCompare(file)}>
            <ScaleIcon size={18} />
          </button>
        )}
      </div>
      <ReactMarkdown
        components={{
          code: ({ node, className: cInputName, children, ...props }: any) => {
            let cLanguage = /language-(\w+)/.exec(cInputName || '')?.[1];
            let code = String(children).trim();
            if (!cLanguage) {
              const firstLine = code.match(/^\s*([\w+-]+)\s*\n/);

              if (firstLine) {
                cLanguage = firstLine[1];
                code = code.slice(firstLine[0].length);
              }
            }
            const isBlock =
              !!cLanguage ||
              node?.position?.start?.line !== node?.position?.end?.line;

            if (isBlock) {
              return (
                <CodeBlock
                  {...props}
                  language={cLanguage ?? 'text'}
                  wrapClasses={cx(
                    'page-border',
                    flashIndex === idx && 'content-flash',
                  )}
                  showCopyButton={language === 'markdown'}
                  className={cInputName}
                  onAnimationEnd={() => setFlashIndex(null)}
                >
                  {code}
                </CodeBlock>
              );
            }
            return <code className={cInputName}>{children}</code>;
          },
        }}
      >
        {language === 'markdown'
          ? fixMarkdown(file.content)
          : fixMarkdown(`\`\`\`${language}\n${file.content}\n\`\`\``)}
      </ReactMarkdown>
    </section>
  );
};
