import { makeFactoryState } from './estate';
import type { ViewRow, JsonArray, JsonObject } from '>/types';

type EditedRow = Record<number, JsonObject> | Record<string, JsonObject>;

type ContextTableState = {
  selectedRows: Map<number, ViewRow<JsonArray>>;
  editedRow: EditedRow;
};

export type ContextTableActions = {
  initialize: () => void;
  clearSelected: () => void;
  setAllRows: (rows: ViewRow<JsonArray>[]) => void;
  setSelectedRow: (row: ViewRow<JsonArray>, active: boolean) => void;
  markEditedRow: (
    row: EditedRow | ((prevState: EditedRow) => EditedRow),
  ) => void;
  hasEdits: () => boolean;
  clearEdits: () => void;
};

export type ContextTableStore = {
  useContextTableStore: <
    TSelected = {
      state: ContextTableState;
      api: ContextTableActions;
    },
  >(
    selector?: (args: {
      state: ContextTableState;
      api: ContextTableActions;
    }) => TSelected,
  ) => TSelected;
  api: ContextTableActions;
  get: () => ContextTableState;
};

type GetOptionsProps = {};

export const createContextTableStore = (options?: GetOptionsProps) => {
  const baseStore = makeFactoryState<ContextTableState>(() => ({
    selectedRows: new Map(),
    editedRow: {},
  }))();

  const { get, set, setAuto } = baseStore;

  const api: ContextTableActions = {
    initialize: () => {
      set(() => ({
        selectedRows: new Map(),
        editedRow: {},
      }));
    },

    setAllRows: (rows) => {
      const selectedRows = new Map(rows.map((r) => [r.offset, r]));
      setAuto({ selectedRows });
    },

    setSelectedRow: (row, active) => {
      set((prev) => {
        const next = new Map(prev.selectedRows);

        if (active) {
          next.set(row.offset, row);
        } else {
          next.delete(row.offset);
        }

        return {
          ...prev,
          selectedRows: next,
        };
      });
    },
    clearSelected: () => {
      setAuto({
        selectedRows: new Map(),
      });
    },
    markEditedRow: (objOrFn) => {
      setAuto((state) => {
        const nextEditedRow =
          typeof objOrFn === 'function' ? objOrFn(state.editedRow) : objOrFn;

        return { editedRow: nextEditedRow };
      });
    },
    clearEdits: () => {
      setAuto({
        editedRow: {},
      });
    },
    hasEdits: () => {
      return Object.keys(get().editedRow).length > 0;
    },
  };

  type SelectorProps = {
    state: ContextTableState;
    api: ContextTableActions;
  };

  const useContextTableStore = <TSelected = SelectorProps>(
    selector?: (args: SelectorProps) => TSelected,
  ): TSelected => {
    const state = baseStore();

    const store = {
      state,
      api,
    };

    return selector ? selector(store) : (store as TSelected);
  };

  // useStore() - classic reactive UI hook with selector pattern
  // get() read only state to use with component action/handlers to avoid re-renders
  // api - state mutations
  // Usage: const store = createContextTableStore()
  // const {useStore, api} = store
  // or const prop = store.get().stateProperty
  return {
    useContextTableStore,
    get,
    api,
  };
};
