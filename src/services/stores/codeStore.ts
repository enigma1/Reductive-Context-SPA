/* File src/services/stores/codeStore.ts
    store service for paths and file selections
*/
import { makeState } from './estate';
import { FileNode } from '>/types';
import type { FolderPath } from '>/contracts';

type ActiveFile = Pick<FileNode, 'path' | 'name'>;

const addSelectedFile = (allFiles: FileNode[], file: FileNode) => {
  const inListIndex = allFiles.findIndex(
    (item) => item.path === file.path && item.name === file.name,
  );

  if (inListIndex === -1) {
    return [...allFiles, file];
  }

  return allFiles.map((item, index) =>
    index === inListIndex
      ? {
          ...item,
          ranges: file.ranges,
        }
      : item,
  );
};

const removeSelectedFile = (
  allFiles: FileNode[],
  file: FileNode,
): FileNode[] => {
  return allFiles.filter(
    (item) => item.path !== file.path || item.name !== file.name,
  );
};

type StoreState = {
  selectedFiles: FileNode[];
  currentPaths: FolderPath[];
  activeFile?: ActiveFile;
  currentPrompt: string;
};

export type CodeStoreActions = {
  addSelectedFile: (file: FileNode) => void;
  removeSelectedFile: (file: FileNode) => void;
  addSelectedFiles: (file: FileNode[]) => void;
  removeSelectedFiles: (file: FileNode[]) => void;
  clearSelectedFiles: () => void;
  getAllSelectedFiles: () => FileNode[];
  isSelectedFile: (file: FileNode) => boolean;

  getCurrentPaths: () => FolderPath[];
  setCurrentPaths: (paths?: FolderPath[]) => void;
  setActiveFile: (file?: FileNode) => void;
  getActiveFile: () => FileNode | undefined;
};

export type CodeStore = StoreState & CodeStoreActions;

const initialState: StoreState = {
  selectedFiles: [],
  currentPaths: [],
  currentPrompt: '',
};

const baseStore = makeState<StoreState>(() => ({ ...initialState }));
const { get, setAuto } = baseStore;

export const codeStoreActions: CodeStoreActions = {
  // Add or Update files use this method
  addSelectedFile: (file) => {
    setAuto((state) => ({
      selectedFiles: addSelectedFile(state.selectedFiles, file),
    }));
  },

  removeSelectedFile: (file) => {
    setAuto((state) => ({
      selectedFiles: removeSelectedFile(state.selectedFiles, file),
    }));
  },

  addSelectedFiles: (files) => {
    setAuto((state) => ({
      selectedFiles: files.reduce(
        (selectedFiles, file) => addSelectedFile(selectedFiles, file),
        state.selectedFiles,
      ),
    }));
  },

  removeSelectedFiles: (files) => {
    setAuto((state) => ({
      selectedFiles: files.reduce(
        (selectedFiles, file) => removeSelectedFile(selectedFiles, file),
        state.selectedFiles,
      ),
    }));
  },

  clearSelectedFiles: () => {
    setAuto({ selectedFiles: [] });
  },

  getAllSelectedFiles: () => {
    return get().selectedFiles;
  },

  isSelectedFile: (file) => {
    return get().selectedFiles.some(
      (item) => item.path === file.path && item.name === file.name,
    );
  },

  getCurrentPaths: () => {
    return get().currentPaths;
  },
  setCurrentPaths: (paths) => {
    setAuto({ currentPaths: paths ?? [] });
  },

  getActiveFile: () => {
    const { activeFile, selectedFiles } = get();

    if (!activeFile) {
      return undefined;
    }

    return selectedFiles.find(
      (file) => file.path === activeFile.path && file.name === activeFile.name,
    );
  },

  setActiveFile: (file) => {
    if (!file) {
      setAuto({ activeFile: undefined });
      return;
    }

    setAuto((state) => {
      const exists = state.selectedFiles.some(
        (selected) =>
          selected.path === file.path && selected.name === file.name,
      );

      return {
        activeFile: {
          path: file.path,
          name: file.name,
        },
        ...(exists
          ? {}
          : {
              selectedFiles: [...state.selectedFiles, file],
            }),
      };
    });
  },
};

type SelectorArgsType = {
  state: StoreState;
  api: CodeStoreActions;
};
export const useCodeStore = <TSelected = StoreState>(
  selector?: (args: SelectorArgsType) => TSelected,
): TSelected => {
  const state = baseStore();
  const api = codeStoreActions;
  return selector ? selector({ state, api }) : ({ state, api } as TSelected);
};
