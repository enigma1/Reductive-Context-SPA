import { MessageList } from '>/modules';
import { HeaderTop, HeaderMenu } from './HeaderComponents';

export const Header = () => {
  return (
    <div className='wrapper'>
      <HeaderTop />
      <MessageList mode='header' />
      <div className='wrapper start full menu-container'>
        <HeaderMenu />
      </div>
    </div>
  );
};
