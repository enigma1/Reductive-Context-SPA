import type { ComponentProps, CSSProperties } from 'react';
import { PrismLight, prismStyle } from '>/config';

type CodeBlockProps = ComponentProps<'code'> & {
  language?: string;
  wrapClasses?: string;
};

export const CodeBlock = ({
  language: languageProp,
  className,
  children,
  style: _style,
  ref: _ref,
  ...props
}: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = languageProp ?? match?.[1] ?? 'text';
  const { wrapClasses, ...prismProps } = props;
  return (
    <div className={wrapClasses}>
      <PrismLight language={language} style={prismStyle} {...prismProps}>
        {String(children).replace(/\n$/, '')}
      </PrismLight>
    </div>
  );
};
