import { redirect } from 'react-router';
import { codeStoreActions } from '>/services/stores';
import { routes } from '>/config';

export const readFileLoader = () => {
  const activeFile = codeStoreActions.getActiveFile();

  if (!activeFile) {
    throw redirect(routes.front.pathsView);
  }
  return null;
};
