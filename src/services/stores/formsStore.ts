import isEqual from 'lodash-es/isEqual';
import { makeState } from './estate';

type FormValues = Record<string, unknown>;
type FormProfile = FormValues[];
type StoreState = {
  profiles: Map<string, FormProfile>;
};

export type FormsStoreActions = {
  addProfile: (id: string, profile: FormProfile) => void;
  removeProfile: (id: string) => void;
  getProfile: (id: string) => FormProfile | undefined;

  addProfileEntry: (id: string, values: FormValues) => void;
  removeProfileEntry: (id: string, index: number) => void;
  getProfileEntry: (id: string, index: number) => FormValues | undefined;

  getProfiles: () => Map<string, FormProfile>;
};

export type FormsStore = StoreState & FormsStoreActions;

const initialState: StoreState = {
  profiles: new Map(),
};

const baseStore = makeState<StoreState>(() => ({ ...initialState }));
const { get, set, setAuto } = baseStore;

export const formsStoreActions: FormsStoreActions = {
  addProfile: (id, profile) => {
    setAuto((state) => {
      const profiles = new Map(state.profiles);
      profiles.set(id, profile);
      return { profiles };
    });
  },

  removeProfile: (id) => {
    setAuto((state) => {
      const profiles = new Map(state.profiles);
      profiles.delete(id);
      return { profiles };
    });
  },

  addProfileEntry: (id, values) => {
    setAuto((state) => {
      const profile = state.profiles.get(id) ?? [];
      if (profile.some((entry) => isEqual(entry, values))) {
        return state;
      }

      const profiles = new Map(state.profiles);
      profiles.set(id, [...profile, values]);

      return { profiles };
    });
  },

  removeProfileEntry: (id, index) => {
    setAuto((state) => {
      const profile = state.profiles.get(id);
      if (!profile) return {};

      const profiles = new Map(state.profiles);
      profiles.set(
        id,
        profile.filter((_, i) => i !== index),
      );
      return { profiles };
    });
  },

  getProfileEntry: (id, index) => {
    return get().profiles.get(id)?.[index];
  },

  getProfile: (id) => {
    return get().profiles.get(id);
  },

  // To consume it
  // for (const [id, profile] of formsStore.getProfiles()) {
  //   // ...
  // }
  // and needs to preserve integrity so return a copy
  getProfiles: () => new Map(get().profiles),
};

type SelectorArgsType = {
  state: StoreState;
  api: FormsStoreActions;
};
export const useFormsStore = <TSelected = StoreState>(
  selector?: (args: SelectorArgsType) => TSelected,
): TSelected => {
  const state = baseStore();
  const api = formsStoreActions;
  return selector ? selector({ state, api }) : ({ state, api } as TSelected);
};
