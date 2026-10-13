import './styles/globals.css';
import { StrictMode } from 'react';
import { redirect } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientHandlers } from '>/bootstrap';
import { codeStoreActions } from '>/services/stores';
import { routes, backPath, userPrefs } from '>/config';
import { configureApiClient } from '>/services/api';

import {
  App,
  AppBootstrap,
  Home,
  NetworkDown,
  BundleView,
  BundleList,
  BundleAnswer,
  PathsView,
  Reader,
  DataTable,
  OpenRouterModelsView,
} from '>/modules';

const readFileLoader = () => {
  const activeFile = codeStoreActions.getActiveFile();

  if (!activeFile) {
    throw redirect(routes.front.pathsView);
  }
  return null;
};

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
        path: routes.front.pathsView,
        element: <PathsView />,
      },
      {
        path: routes.front.bundleView,
        element: <BundleView />,
      },
      {
        path: routes.front.readFile,
        loader: readFileLoader,
        element: <Reader />,
      },
      {
        path: routes.front.bundleList,
        element: <BundleList />,
      },
      {
        path: routes.front.bundleAnswer,
        element: <BundleAnswer />,
      },
      {
        path: routes.front.openRouterModelsView,
        element: <OpenRouterModelsView />,
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
