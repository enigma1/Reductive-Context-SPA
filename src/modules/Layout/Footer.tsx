import { GraphStarIcon } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='inline-wrapper'>
      <a
        target='_blank'
        href='https://github.com/enigma1/Reductive-Context-SPA'
        title='reductive context workspace'
      >
        <GraphStarIcon size={16} />
      </a>
      {`Reductive Context Workspace - Copyright (c) ${currentYear} Mark Samios`}
    </footer>
  );
};
