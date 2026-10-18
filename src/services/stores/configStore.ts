/* File: src/services/stores/configStore.ts
  Processes user preferences
*/
import cloneDeep from 'lodash-es/cloneDeep';
import { userPrefs } from '>/config';
import type { UserPrefs, LayoutPrefs, ConversationMode } from '>/contracts';
import { makeState } from './estate';

type ConfigStoreState = UserPrefs;

export type ConfigStoreActions = {
  setTheme: (value?: string) => void;
  getPreferences: () => ConfigStoreState;
  savePreferences: (prefs?: Partial<ConfigStoreState>) => void;
  getLayoutPrefs: () => LayoutPrefs;
  setLayoutPrefs: (prefs: Partial<LayoutPrefs>) => void;
  getConversationMode: () => ConversationMode;
  setConversationMode: (mode: ConversationMode) => void;
  setSidebarWidth: (width: number) => void;
};

// type ConfigStore = ConfigStoreState & ConfigStoreActions;

const initialState: ConfigStoreState = userPrefs;

const baseStore = makeState<ConfigStoreState>(() => {
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

  getConversationMode: () => get().conversationMode,
  setConversationMode: (mode) => {
    setAuto({ conversationMode: mode });
  },

  setSidebarWidth: (width) => {
    setAuto({ sidebarWidth: width });
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
