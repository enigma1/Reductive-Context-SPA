/* File: src/services/editor.ts 
  Do not expose 3rd party urls
*/
import { loader } from '@monaco-editor/react';

let promise: Promise<void> | null = null;

export const ensureMonaco = () => {
  if (!promise) {
    promise = (async () => {
      const monaco = await import('monaco-editor');
      const editorWorker =
        await import('monaco-editor/editor/editor.worker?worker');
      const jsonWorker =
        await import('monaco-editor/language/json/json.worker?worker');

      self.MonacoEnvironment = {
        getWorker(_, label) {
          if (label === 'json') return new jsonWorker.default();
          return new editorWorker.default();
        },
      };

      loader.config({ monaco });
    })();
  }
  return promise;
};
