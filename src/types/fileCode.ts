// export type SelectionState = 'selected' | 'indeterminate' | 'unselected';

export type FilesByFolder = Record<string, string[]>;

type Language = 'typescript' | 'javascript' | 'python';

export type SignatureExtractor = {
  canHandle: (fileName: string) => boolean;
  extract: (source: string) => string;
};
