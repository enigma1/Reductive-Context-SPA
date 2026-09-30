import { makeState } from './estate';

type ActiveTableGuard = () => Promise<boolean>;
export type AppStoreState = {
  online: boolean;
  activeTableGuard?: ActiveTableGuard;
};

export type AppStoreActions = {
  batch: (fn: () => void) => void;
  initialize: (cfg?: Partial<AppStoreState>) => void;
  getAppStatus: () => boolean;
  setAppStatus: (value: boolean) => void;
  triggerGuard: () => Promise<boolean>;
  registerActiveTableGuard: (guard: ActiveTableGuard) => () => void;
};

export type AppStore = AppStoreState & AppStoreActions;

const initialState: AppStoreState = {
  online: true,
} as const;

const baseStore = makeState<AppStoreState>(() => initialState);
const { get, set, setAuto, batch } = baseStore;

export const appStoreActions: AppStoreActions = {
  batch,
  initialize: (cfg) => {
    set(() => ({ ...initialState, ...cfg }));
  },
  getAppStatus: () => get().online,
  setAppStatus: (value) => setAuto({ online: value }),
  triggerGuard: async () => {
    const guard = get().activeTableGuard;

    if (guard) {
      const allowed = await guard();

      if (!allowed) {
        return false;
      }
    }
    return true;
  },
  registerActiveTableGuard: (guard) => {
    setAuto({
      activeTableGuard: guard,
    });

    return () => {
      setAuto({
        activeTableGuard: undefined,
      });
    };
  },
};

type SelectorArgsType = {
  state: AppStoreState;
  api: AppStoreActions;
};

export const useAppStore = <T = AppStore>(
  selector?: (state: SelectorArgsType) => T,
): T => {
  const state = baseStore();
  const api = appStoreActions;
  return selector ? selector({ state, api }) : ({ state, api } as T);
};
