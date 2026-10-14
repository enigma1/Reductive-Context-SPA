/* File: src/types/filecode.ts
  types for paths and files processed
  Paths for selecting files
  Bundled files send to LLM
  Files recommended by the LLM
*/
export type FilesByFolder = Record<string, string[]>;

export type SignatureExtractor = {
  canHandle: (fileName: string) => boolean;
  extract: (source: string) => string;
};
