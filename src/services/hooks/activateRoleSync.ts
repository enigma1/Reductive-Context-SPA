/* File: src/services/hooks/useActivateRoleSync.ts
  Hook to trigger and manage role activation state lifecycle
*/
import { useState, useEffect } from 'react';
import { ActivateRoleResponse } from '>/contracts';
import { useActivateRole } from '>/services/queryHooks';
import { useConfigStore, messageStoreActions } from '>/services/stores';

export const useActivateRoleSync = () => {
  const { currentRole, setCurrentModel, setCurrentRole } = useConfigStore(
    ({ state, api }) => ({
      currentRole: state.currentRole,
      setCurrentModel: api.setCurrentModel,
      setCurrentRole: api.setCurrentRole,
    }),
  );
  const [lastRole, setLastRole] = useState<string>(currentRole);

  const { mutate: mutateActivateRole, isPending } = useActivateRole(
    ({ query, api }) => ({
      mutate: api.mutate,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
    }),
  );

  const callbacks = {
    onSuccess: (data: ActivateRoleResponse) => {
      if (data.ok) {
        data.aiStatus.active ? setCurrentModel(data.aiStatus.model) : undefined;
        setLastRole(currentRole);
        messageStoreActions.addMessage({
          content: {
            type: 'success',
            text: `Role ${currentRole} activated`,
            duration: 4000,
          },
        });
      }
    },
    onError: () => {
      setCurrentRole(lastRole);
      messageStoreActions.addMessage({
        content: {
          text: 'Setting LLM Role failed.',
          duration: 6000,
        },
      });
    },
  };

  useEffect(() => {
    mutateActivateRole({ roleName: currentRole }, callbacks);
  }, [currentRole]);

  return {
    isPending,
  };
};
