import { Outlet } from 'react-router';
import { useConfigStore } from '>/services/stores';
import {
  LeftSide,
  RightSide,
  Header,
  Footer,
  GlobalDialog,
  GlobalDialogError,
} from '>/modules';

export const App = () => {
  const { layout } = useConfigStore(({ state }) => ({
    layout: state.layout,
  }));

  return (
    <>
      <div className='app'>
        {layout.showHeader && <Header />}
        <div className='app-content'>
          {layout.showLeftSide && <LeftSide />}
          <main>
            <Outlet />
          </main>
          {layout.showRightSide && <RightSide />}
        </div>
        {layout.showFooter && <Footer />}
      </div>
      <GlobalDialog />
      <GlobalDialogError />
    </>
  );
};
