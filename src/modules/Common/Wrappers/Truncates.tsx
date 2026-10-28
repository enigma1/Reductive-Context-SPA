import { ReactNode } from 'react';

type TruncateSpanProps = {
  content: string | ReactNode;
};
export const TruncateSpan = ({ content }: TruncateSpanProps) => {
  return typeof content === 'string' ? (
    <span className='truncate min-w-0 flex-1'>{content}</span>
  ) : (
    content
  );
};
