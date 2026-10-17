import { useState, type ComponentProps } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { PrismLight, prismStyle } from '>/config';

type CodeBlockProps = ComponentProps<'code'> & {
  language?: string;
  wrapClasses?: string;
  showCopyButton?: boolean;
};

export const CodeBlock = ({
  language: languageProp,
  className,
  children,
  style: _style,
  ref: _ref,
  showCopyButton,
  ...props
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = languageProp ?? match?.[1] ?? 'text';
  const { wrapClasses, ...prismProps } = props;

  const handleCopy = () => {
    const content = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${wrapClasses || ''}`}>
      {showCopyButton && (
        <div className='absolute right-2 top-2 z-10'>
          <button
            onClick={handleCopy}
            className='btn-square p-1.5 rounded-md transition-colors opacity-80 group-hover:opacity-100 flex items-center gap-1 text-xs'
            title='Copy code'
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          </button>
        </div>
      )}
      <PrismLight language={language} style={prismStyle} {...prismProps}>
        {String(children).replace(/\n$/, '')}
      </PrismLight>
    </div>
  );
};

export const MarkdownComponents = {
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    // Block code: has a language class OR spans multiple lines
    const isBlock =
      !!match || node?.position?.start?.line !== node?.position?.end?.line;

    if (isBlock) {
      return (
        <CodeBlock {...props} className={className}>
          {children}
        </CodeBlock>
      );
    }
    return <code className={className}>{children}</code>;
  },
};
