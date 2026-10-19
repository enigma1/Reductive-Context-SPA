import { useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { apiPoints } from '>/services/api';
import { appStoreActions, messageStoreActions } from '>/services/stores';

export const AliveMonitor = () => {
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let failures = 0;

    const check = async () => {
      let nextDelay = 8000;

      try {
        const rsp = await apiPoints.checkSession();
        if (!rsp.ok) {
          messageStoreActions.addMessage({
            content: {
              text: `Error: ${rsp.message}`,
              duration: 4000,
            },
          });
        }

        if (cancelled) return;

        failures = 0;

        if (!appStoreActions.getAppStatus()) {
          onlineManager.setOnline(true);
          appStoreActions.setAppStatus(true);
        }
        nextDelay = 20_000;
      } catch {
        failures++;

        if (failures >= 2) {
          onlineManager.setOnline(false);
          appStoreActions.setAppStatus(false);
          nextDelay = 3000;
        } else {
          nextDelay = nextDelay >> failures;
        }
      }

      if (!cancelled) {
        timeoutId = setTimeout(check, nextDelay);
      }
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);
  return null;
};
