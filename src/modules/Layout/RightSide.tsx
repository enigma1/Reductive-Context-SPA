import { Link } from 'react-router';
import { dialogStoreActions } from '>/services/stores';
import { dialogFactories } from '>/modules';
import { routes } from '>/config';

export const RightSide = () => {
  return (
    <div className='right-side '>
      <div className='page-heading'>
        <div className='page-spacer'>
          <div className='page-title'>Optional Right Side</div>
        </div>
      </div>
      <div className='page-content'>
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
    </div>
  );
};
