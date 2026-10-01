/* File src/services/hooks/editor.ts
  Identifies file language
  Implements an editor hook to set line ranges
*/
import isEqual from 'lodash-es/isEqual';
import { useState, useRef } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { CodeRange, FileNode } from '>/types';

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
