/* File src/services/hooks/editor.ts
  Identifies file language
  Implements monaco editor hooks for file editing/reading
*/
import isEqual from 'lodash-es/isEqual';
import { useState, useRef } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { CodeRange, FileNode } from '>/contracts';

type CodeRangesComparison = {
  original: CodeRange[];
  modified: CodeRange[];
};

const mergeRanges = ({ original, modified }: CodeRangesComparison) => {
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

const areRangesEqual = ({ original, modified }: CodeRangesComparison) =>
  isEqual(
    mergeRanges({ original: [], modified: original }),
    mergeRanges({ original: [], modified: modified }),
  );

const extToLanguage: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  astro: 'html',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  htm: 'html',
  md: 'markdown',
  py: 'python',
  rs: 'rust',
  go: 'go',
  java: 'java',
  sql: 'sql',
  sh: 'shell',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'ini',
  xml: 'xml',
  svg: 'xml',
};

const getMonacoLanguage = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return extToLanguage[ext] ?? 'plaintext';
};

export const useViewerSelection = (file?: FileNode) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const language = file ? getMonacoLanguage(file.name) : undefined;

  const getSelections = (): CodeRange[] => {
    const selections = editorRef.current?.getSelections();

    if (!selections) {
      return [];
    }

    return selections.map((selection) => ({
      startLine: Math.min(selection.startLineNumber, selection.endLineNumber),
      endLine: Math.max(selection.startLineNumber, selection.endLineNumber),
    }));
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!file) {
      return;
    }

    const initialSelections = (file.ranges ?? []).map((range) => {
      const endColumn = editor.getModel()?.getLineMaxColumn(range.endLine) ?? 1;

      return {
        selectionStartLineNumber: range.startLine,
        selectionStartColumn: 1,
        positionLineNumber: range.endLine,
        positionColumn: endColumn,
      };
    });

    if (initialSelections.length > 0) {
      editor.setSelections(initialSelections);
    }

    editor.onDidChangeCursorSelection(() => {
      const modified = getSelections();
      const original = file?.ranges ?? [];
      setIsDirty(
        !areRangesEqual({
          original,
          modified,
        }),
      );
    });
  };

  return {
    onMount,
    getSelections,
    isDirty,
    language,
  };
};

export const useEditorBundle = () => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      setIsDirty(true);
    });
  };

  return {
    onMount,
    isDirty,
  };
};

export const useEditor = (filename?: string) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const language = filename ? getMonacoLanguage(filename) : undefined;
  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return {
    onMount,
    language,
  };
};
