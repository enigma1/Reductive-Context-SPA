/* File src/services/hooks/editor.ts
  Identifies file language
  Implements an editor hook to set line ranges
*/
import { useRef } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { CodeRange, FileNode } from '>/types';

const getMonacoLanguage = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    default:
      return 'plaintext';
  }
};

export const useEditorSelection = (file?: FileNode) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const language = file ? getMonacoLanguage(file.name) : undefined;

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!file) {
      return;
    }

    const decorations =
      file.ranges?.map((range) => ({
        range: new monaco.Range(range.startLine, 1, range.endLine, 1),
        options: {
          isWholeLine: true,
          className: 'code-range',
        },
      })) ?? [];

    editor.createDecorationsCollection(decorations);
  };

  const getSelection = (): CodeRange | undefined => {
    const selection = editorRef.current?.getSelection();

    if (!selection) {
      return undefined;
    }

    return {
      startLine: Math.min(selection.startLineNumber, selection.endLineNumber),
      endLine: Math.max(selection.startLineNumber, selection.endLineNumber),
    };
  };

  return {
    onMount,
    getSelection,
    language,
  };
};
