import cloneDeep from 'lodash-es/cloneDeep';
import { makeState } from './estate';
import { userPrefs } from '>/services/utils';
import { apiClient } from '>/services/api/client';
import { backPath } from '>/config';
import type { UserPrefs, LayoutPrefs } from '>/contracts';

type ConfigStoreState = UserPrefs;

export type ConfigStoreActions = {
  setTheme: (value?: string) => void;
  getPreferences: () => ConfigStoreState;
  savePreferences: (prefs?: Partial<ConfigStoreState>) => void;
  getLayoutPrefs: () => LayoutPrefs;
  setLayoutPrefs: (prefs: Partial<LayoutPrefs>) => void;
};

// type ConfigStore = ConfigStoreState & ConfigStoreActions;

const initialState: ConfigStoreState = userPrefs;

const baseStore = makeState<ConfigStoreState>(() => {
  apiClient.defaults.baseURL = `${backPath}:${userPrefs.backPort}`;
  return cloneDeep(initialState);
});
const { get, set, setAuto } = baseStore;

export const configStoreActions: ConfigStoreActions = {
  setTheme: (value) => {
    const theme = value ?? get().theme;
    document.documentElement.setAttribute('data-theme', theme);
    setAuto({ theme });
  },
  getLayoutPrefs: () => {
    return get().layout;
  },
  setLayoutPrefs: (prefs) => {
    set((prev) => ({
      ...prev,
      layout: prev.layout,
      ...prefs,
    }));
  },
  getPreferences: () => {
    return userPrefs;
  },
  savePreferences: (settings?: Partial<ConfigStoreState>) => {
    const modSettings = settings ?? get();
    setAuto({ ...modSettings });
  },
};

type SelectorProps = {
  state: ConfigStoreState;
  api: ConfigStoreActions;
};
export const useConfigStore = <TSelected = ConfigStoreState>(
  selector?: (args: SelectorProps) => TSelected,
): TSelected => {
  const state = baseStore();
  const api = configStoreActions;
  const store = { state, api };
  return selector ? selector(store) : (store as TSelected);
};
