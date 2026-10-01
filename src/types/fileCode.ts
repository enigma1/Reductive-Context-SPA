// export type SelectionState = 'selected' | 'indeterminate' | 'unselected';

export type CodeRange = {
  startLine: number;
  endLine: number;
};

type FileMode = 'code' | 'signature';

export type FileNode = {
  path: string;
  name: string;
  ranges?: CodeRange[];
  mode: FileMode;
};

export type FilesByFolder = Record<string, string[]>;

type Language = 'typescript' | 'javascript' | 'python';

export type SignatureExtractor = {
  canHandle: (fileName: string) => boolean;
  extract: (source: string) => string;
};
