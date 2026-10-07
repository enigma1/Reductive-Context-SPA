import './styles/globals.css';
import { StrictMode } from 'react';
import { redirect } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientHandlers } from '>/services/api';
import { codeStoreActions } from '>/services/stores';
import { routes } from '>/config';
import {
  App,
  Home,
  NetworkDown,
  BundleView,
  PathsView,
  Reader,
  DataTable,
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

ReactDOM.createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClientHandlers}>
      <RouterProvider router={browserRouter} />
    </QueryClientProvider>
  </StrictMode>,
);
