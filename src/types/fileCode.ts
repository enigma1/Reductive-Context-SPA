// export type SelectionState = 'selected' | 'indeterminate' | 'unselected';

export type CodeRange = {
  startLine: number;
  endLine: number;
};

export type FileNode = {
  path: string;
  name: string;
  ranges?: CodeRange[];
};

export type FilesByFolder = Record<string, string[]>;
