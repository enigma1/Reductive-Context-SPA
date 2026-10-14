/* File: src/services/hooks/useBundleSync.ts
  Hook to synchronize bundle response from react query and code store
*/
import { useEffect } from 'react';
import { useCodeStore } from '>/services/stores/codeStore';
import { useGetBundle } from '>/services/queryHooks';

export const useBundleSync = () => {
  const { activeBundleId, setBundleSession } = useCodeStore(
    ({ state, api }) => ({
      activeBundleId: state.activeBundleId,
      setBundleSession: api.setBundleSession,
    }),
  );

  const { bundleId, rootPaths, prompt, isFetched } = useGetBundle(
    {
      bundleId: activeBundleId ?? 0,
    },
    ({ state, query }) => ({
      isFetched: query.isFetched,
      bundleId: state.bundleId,
      rootPaths: state.rootPaths,
      prompt: state.prompt,
    }),
  );

  useEffect(() => {
    if (!isFetched || bundleId !== activeBundleId) return;
    setBundleSession({
      activePrompt: prompt,
      bundleStream: 'idle',
      activePaths: rootPaths,
      selectedFiles: [],
    });
  }, [isFetched, activeBundleId, rootPaths, prompt]);
};
