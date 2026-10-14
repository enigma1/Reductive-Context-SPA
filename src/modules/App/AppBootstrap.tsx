import { useState, useEffect, type ReactNode } from 'react';
import { useGetLanguages } from '>/services/queryHooks';
import { useBundleSync } from '>/services/hooks';
import { ScreenLoader } from '>/modules';
import { setExtensionLanguages } from '>/config';

export const AppBootstrap = ({ children }: { children: ReactNode }) => {
  const [bootstrap, setBootstrap] = useState<boolean>(false);
  const { isFetching, isFetched, languages } = useGetLanguages(
    undefined,
    ({ state, query }) => ({
      isFetching: query.isFetching,
      isFetched: query.isFetched,
      languages: state.languages,
    }),
  );
  const ready = isFetched && !isFetching;

  useEffect(() => {
    if (!ready) return;
    setExtensionLanguages(languages);
    setBootstrap(true);
  }, [ready, languages]);
  useBundleSync();

  if (!bootstrap) {
    return <ScreenLoader />;
  }

  return children;
};
