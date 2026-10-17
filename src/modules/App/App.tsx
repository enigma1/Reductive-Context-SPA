import { Navigate, Outlet, useLocation } from 'react-router';
import { routes } from '>/config';
import { useConfigStore, useAppStore } from '>/services/stores';
import {
  AliveMonitor,
  LeftSide,
  RightSide,
  Header,
  Footer,
  GlobalDialog,
  GlobalDialogError,
} from '>/modules';

export const App = () => {
  const online = useAppStore(({ state }) => state.online);
  const { layout } = useConfigStore(({ state }) => ({
    layout: state.layout,
  }));
  const location = useLocation();

  if (!online && location.pathname !== routes.front.networkDown) {
    return <Navigate to={routes.front.networkDown} replace />;
  }
  return (
    <>
      <div className='app'>
        <AliveMonitor />
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
