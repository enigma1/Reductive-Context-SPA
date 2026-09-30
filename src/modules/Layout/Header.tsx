import { HeaderTop, HeaderMenu, HeaderMessageList } from './HeaderComponents';

export const Header = () => {
  return (
    <div className='app-header wrapper'>
      <div>
        <HeaderTop />
      </div>
      <div>
        <HeaderMessageList />
      </div>
      <div className='wrapper start full'>
        <HeaderMenu />
      </div>
    </div>
  );
};
