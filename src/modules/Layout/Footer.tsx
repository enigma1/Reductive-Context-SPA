import { GraphStarIcon } from 'lucide-react';
import { MessageList } from '>/modules';

export const Footer = () => {
  const initialYear = 2026;
  const currentYear = new Date().getFullYear();
  const timeRange =
    initialYear === currentYear
      ? initialYear
      : `${initialYear} - ${currentYear}`;

  return (
    <>
      <MessageList mode='footer' />
      <footer className='inline-wrapper text-sm'>
        <a
          target='_blank'
          href='https://github.com/enigma1/Reductive-Context-SPA'
          title='reductive context workspace'
        >
          <GraphStarIcon size={16} />
        </a>
        {`Reductive Context Workspace - Copyright (c) ${timeRange} Mark Samios`}
      </footer>
    </>
  );
};
