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
      let nextDelay = 5000;

      try {
        const rsp = await apiPoints.checkSession();
        if (!rsp.ok) {
          messageStoreActions.addMessage({
            content: {
              text: 'Invalid Session Detected - Please login again',
              duration: 3000,
            },
          });
        }

        if (cancelled) return;

        failures = 0;

        if (!appStoreActions.getAppStatus()) {
          appStoreActions.setAppStatus(true);
          onlineManager.setOnline(true);
        }
        nextDelay = 20000;
      } catch {
        failures++;

        if (failures >= 3) {
          appStoreActions.setAppStatus(false);
          onlineManager.setOnline(false);
          nextDelay = 5000;
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
