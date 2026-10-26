/* File: src/services/hooks/useBundleSync.ts
  Hook to synchronize bundle response from react query and code store
*/
import { useEffect } from 'react';
import { useCodeStore } from '>/services/stores/codeStore';
import { useGetBundle } from '>/services/queryHooks';
import { transformUserFiles } from '>/services/utils';

export const useBundleSync = () => {
  const { activeBundleId, setBundleSession } = useCodeStore(
    ({ state, api }) => ({
      activeBundleId: state.activeBundleId,
      setBundleSession: api.setBundleSession,
    }),
  );

  const { bundleId, rootPaths, prompt, userFiles, isFetched, textTrees } =
    useGetBundle(
      {
        bundleId: activeBundleId ?? 0,
      },
      ({ state, query }) => ({
        isFetched: query.isFetched,
        bundleId: state.bundleId,
        rootPaths: state.rootPaths,
        prompt: state.prompt,
        userFiles: state.userFiles,
        textTrees: state.textTrees,
      }),
    );

  useEffect(() => {
    if (!isFetched || bundleId !== activeBundleId) return;
    setBundleSession({
      activePrompt: prompt,
      bundleStream: 'idle',
      activePaths: rootPaths,
      selectedFiles: transformUserFiles(userFiles),
    });
  }, [isFetched, activeBundleId, rootPaths, prompt]);
};
