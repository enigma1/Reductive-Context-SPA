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
  SideWrapper,
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
        {online ? (
          <>
            {layout.showHeader && <Header />}
            <div className='app-content'>
              {layout.showLeftSide && <SideWrapper component={LeftSide} />}
              <main>
                <Outlet />
              </main>
              {layout.showRightSide && <SideWrapper component={RightSide} />}
            </div>
            {layout.showFooter && <Footer />}
          </>
        ) : (
          <main>
            <Outlet />
          </main>
        )}
      </div>
      <GlobalDialog />
      <GlobalDialogError />
    </>
  );
};
