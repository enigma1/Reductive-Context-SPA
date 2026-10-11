import { PrismLight, oneLight } from '>/config';

export const CodeBlock = ({ className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1] || 'text';

  return (
    <PrismLight language={language} style={oneLight} {...props}>
      {String(children).replace(/\n$/, '')}
    </PrismLight>
  );
};
