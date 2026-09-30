import { useRef } from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router';
import { dialogStoreActions } from '>/services/stores';
import { DropdownMenu, dialogFactories, GuardedLink } from '>/modules';
import { routes } from '>/config';

export const HeaderMenu = () => {
  return (
    <div className='menu'>
      <DropdownMenu label='Pages'>
        <button onClick={() => {}}>Some Page</button>
        <Link to={routes.front.home}>Go Home</Link>
      </DropdownMenu>
      <div className='menu-separator'>|</div>
      <DropdownMenu label='Server'>
        <button
          onClick={() => {
            dialogStoreActions.openDialog({
              payload: dialogFactories.confirmation({
                caption: 'Test Message',
                message: 'This is a test message',
                note: 'This is a note for the test message',
                onConfirm: () => {},
              }),
            });
          }}
        >
          Clear Pending
        </button>
        <GuardedLink to={routes.front.home}>Guarded Link</GuardedLink>
      </DropdownMenu>
    </div>
  );
};
