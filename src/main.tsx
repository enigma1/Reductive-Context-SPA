import './styles/globals.css';
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientHandlers } from '>/bootstrap';
import { routes, backPath, userPrefs } from '>/config';
import { configureApiClient } from '>/services/api';
import { readFileLoader, bundleViewLoader } from '>/loaders';
import {
  App,
  AppBootstrap,
  Home,
  NetworkDown,
  RoleListRoute,
  RoleViewRoute,
  BundleViewRoute,
  BundleListRoute,
  BundleAnswerRoute,
  PathsViewRoute,
  Reader,
  DataTable,
  OpenRouterModelsViewRoute,
} from '>/modules';

export const browserRouter = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        index: true, // set as the home page "/"
        element: <Home />,
      },
      {
        path: routes.front.roleList,
        element: <RoleListRoute />,
      },
      {
        path: routes.front.roleView,
        element: <RoleViewRoute />,
      },

      {
        path: routes.front.pathsView,
        element: <PathsViewRoute />,
      },
      {
        path: routes.front.readFile,
        loader: readFileLoader,
        element: <Reader />,
      },
      {
        path: routes.front.bundleList,
        element: <BundleListRoute />,
      },
      {
        path: routes.front.bundleView,
        loader: bundleViewLoader,
        element: <BundleViewRoute />,
      },
      {
        path: routes.front.bundleAnswer,
        element: <BundleAnswerRoute />,
      },
      {
        path: routes.front.openRouterModelsView,
        element: <OpenRouterModelsViewRoute />,
      },
      {
        path: routes.front.tableData,
        element: <DataTable />,
      },
      {
        path: routes.front.networkDown,
        element: <NetworkDown />,
      },
    ],
  },
]);

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'Count not start application. No root element found in the DOM.',
  );
}

configureApiClient(`${backPath}:${userPrefs.backPort}`);
// console.log('start', `${backPath}:${userPrefs.backPort}`);
ReactDOM.createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClientHandlers}>
      <AppBootstrap>
        <RouterProvider router={browserRouter} />
      </AppBootstrap>
    </QueryClientProvider>
  </StrictMode>,
);
