import { useConfigStore } from '>/services/stores';
import { useGetRole } from '>/services/queryHooks';

export const RoleViewRoute = () => {
  const { currentRole } = useConfigStore(({ state, api }) => ({
    currentRole: state.currentRole,
  }));

  const {
    roleMain,
    contentRules,
    contentExamples,
    scopePrompt,
    scopeRules,
    scopeExamples,
    isFetching,
    refetch,
  } = useGetRole({ name: currentRole }, ({ state, query }) => ({
    roleMain: state.roleMain,
    contentRules: state.contentRules,
    contentExamples: state.contentExamples,
    scopePrompt: state.scopePrompt,
    scopeRules: state.scopeRules,
    scopeExamples: state.scopeExamples,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }));

  return null;
};
