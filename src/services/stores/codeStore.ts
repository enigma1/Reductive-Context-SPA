/* File src/services/stores/codeStore.ts
    store service for paths and file selections
*/
import { makeState } from './estate';
import { FileNode, CodeRange } from '>/types';
import type { FolderPath } from '>/contracts';

type MergeRangesProps = {
  original: CodeRange[];
  modified: CodeRange[];
};
const mergeRanges = ({ original, modified }: MergeRangesProps) => {
  const allRanges = [...original, ...modified].sort(
    (a, b) => a.startLine - b.startLine,
  );
  const merged: CodeRange[] = [];

  for (const range of allRanges) {
    const last = merged[merged.length - 1];
    if (last && range.startLine <= last.endLine + 1) {
      last.endLine = Math.max(last.endLine, range.endLine);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
};

const addSelectedFile = (allFiles: FileNode[], file: FileNode) => {
  const inListIndex = allFiles.findIndex(
    (item) => item.path === file.path && item.name === file.name,
  );
  if (inListIndex === -1) {
    return [...allFiles, file];
  }
  const existing = allFiles[inListIndex];
  if (!existing.ranges && !file.ranges) return allFiles;

  if (!existing.ranges || !file.ranges) {
    return allFiles.map((item, idx) =>
      idx === inListIndex ? { ...item, ranges: undefined } : item,
    );
  }

  const mergedRanges = mergeRanges({
    original: existing.ranges,
    modified: file.ranges,
  });
  return allFiles.map((item, index) =>
    index === inListIndex ? { ...item, ranges: mergedRanges } : item,
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
  activeFile?: FileNode;
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
    return get().activeFile;
  },
  setActiveFile: (file) => {
    setAuto({ activeFile: file });
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
