import { Link } from 'react-router';
import { dialogStoreActions } from '>/services/stores';
import { DropdownMenu, dialogFactories } from '>/modules';
import { routes } from '>/config';

export const HeaderMenu = () => {
  return (
    <div className='menu'>
      <DropdownMenu label='Pages'>
        <button
          title='Set Root Files'
          onClick={() => {
            dialogStoreActions.openDialog({
              payload: dialogFactories.setFilePaths(),
            });
          }}
        >
          Set Root Files
        </button>
        <Link to={routes.front.bundleList}>All Bundles</Link>
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
        <Link to={routes.front.openRouterModelsView}>Open Router Models</Link>
      </DropdownMenu>
    </div>
  );
};
