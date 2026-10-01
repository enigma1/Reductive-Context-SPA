import { Link } from 'react-router';
import { dialogStoreActions } from '>/services/stores';
import { dialogFactories } from '>/modules';
import { routes } from '>/config';

export const LeftSide = () => {
  return (
    <>
      <div className='left-side'>
        <div className='page-heading'>
          <div className='page-spacer'>
            <div className='page-title'>Conversations</div>
          </div>
        </div>
        <div className='page-content'>
          <div className='page-section'>
            <h2 className='stand'>Views</h2>
            <Link to={routes.front.home}>Home</Link>
            <Link to={routes.front.info}>Info</Link>
            <Link to={routes.front.data}>Data Table</Link>
            <Link to={routes.front.down}>Maintenance</Link>
          </div>
        </div>
      </div>
    </>
  );
};
