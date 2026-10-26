import { Link } from 'react-router';
import { GraphStarIcon } from 'lucide-react';
import { routes } from '>/config';
import { useConfigStore } from '>/services/stores';
import { MessageList } from '>/modules';

export const Footer = () => {
  const { currentRole } = useConfigStore(({ state }) => ({
    currentRole: state.currentRole,
  }));

  const initialYear = 2026;
  const currentYear = new Date().getFullYear();
  const timeRange =
    initialYear === currentYear
      ? initialYear
      : `${initialYear} - ${currentYear}`;

  return (
    <>
      <MessageList mode='footer' />
      <footer className='inline-wrapper text-sm px-3'>
        <a
          target='_blank'
          href='https://github.com/enigma1/Reductive-Context-SPA'
          title='reductive context workspace'
        >
          <GraphStarIcon size={16} />
        </a>
        {`Reductive Context Workspace - Copyright (c) ${timeRange} Mark Samios`}
        <div className='ml-auto flex gap-2 inverted-text'>
          <Link to={routes.front.roleList}>{currentRole}</Link>
        </div>
      </footer>
    </>
  );
};
