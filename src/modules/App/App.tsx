import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useConfigStore } from '>/services/stores';
import { configureApiClient } from '>/services/api';
import { backPath } from '>/config';
import {
  LeftSide,
  RightSide,
  Header,
  Footer,
  GlobalDialog,
  GlobalDialogError,
} from '>/modules';

export const App = () => {
  const { layout, backPort } = useConfigStore(({ state }) => ({
    layout: state.layout,
    backPort: state.backPort,
  }));

  useEffect(() => {
    configureApiClient(`${backPath}:${backPort}`);
  }, [backPort]);

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
