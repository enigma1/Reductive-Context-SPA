import { redirect } from 'react-router';
import { codeStoreActions } from '>/services/stores';
import { routes } from '>/config';

export const bundleViewLoader = () => {
  const activeBundleId = codeStoreActions.getActiveBundleId();

  if (!activeBundleId) {
    throw redirect(routes.front.bundleList);
  }
  return null;
};
