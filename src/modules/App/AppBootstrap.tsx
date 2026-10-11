import { useState, useEffect, type ReactNode } from 'react';
import { useGetLanguages } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';
import { setExtensionLanguages } from '>/config';

export const AppBootstrap = ({ children }: { children: ReactNode }) => {
  const [bootstrap, setBootstrap] = useState<boolean>(false);
  const { isSuccess, isFetching, languages } = useGetLanguages(
    undefined,
    ({ state, query }) => ({
      isSuccess: query.isSuccess,
      isFetching: query.isFetching,
      languages: state.languages,
    }),
  );

  useEffect(() => {
    if (!isSuccess) return;
    setExtensionLanguages(languages);
    setBootstrap(true);
  }, [isSuccess, languages]);

  if (!bootstrap) {
    return <ScreenLoader />;
  }
  return children;
};
