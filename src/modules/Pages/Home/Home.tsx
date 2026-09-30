import { Link } from 'react-router';
import { dialogStoreActions } from '>/services/stores';
import { dialogFactories } from '>/modules';
import { routes } from '>/config';

export const Home = () => {
  return (
    <>
      <div className='page-heading'>
        <div className='page-spacer'>
          <div className='page-title'>Home Page</div>
        </div>
      </div>
      <div className='page-content'>
        <div className='page-section'>
          <h2 className='stand'>Views</h2>
          <Link to={routes.front.home}>Home</Link>
          <Link to={routes.front.pathsView}>Scan Files</Link>
          <button
            title='Set Root Files'
            className='btn-secondary'
            onClick={() => {
              dialogStoreActions.openDialog({
                payload: dialogFactories.setFilePaths(),
              });
            }}
          >
            Set Root Files
          </button>
          <Link to={routes.front.tableData}>Data Table</Link>
          <Link to={routes.front.down}>Maintenance</Link>
        </div>
        <div className='page-section items-start'>
          <h2 className='stand'>Dialogs</h2>
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
            Error
          </button>
          <button onClick={() => {}}>Abort</button>
        </div>
      </div>
    </>
  );
};
