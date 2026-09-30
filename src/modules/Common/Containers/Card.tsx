import type { ReactNode } from 'react';

type CardProps = {
  title?: ReactNode;
  content: ReactNode;
  controls?: ReactNode;
};

export const Card = ({ title, content, controls }: CardProps) => (
  <div className='card-container'>
    {title && <div className='card-title'>{title}</div>}
    <div className='card-content'>{content}</div>
    {controls && <div className='card-controls'>{controls}</div>}
  </div>
);
