/* File src/services/hooks/editor.ts
  Implements monaco editor hooks for file editing/reading
*/
import isEqual from 'lodash-es/isEqual';
import { useState, useRef } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { ContentRange, FileNode } from '>/contracts';
import { getLanguageFromFilename } from '>/services/utils';

type CodeRangesComparison = {
  original: ContentRange[];
  modified: ContentRange[];
};

const mergeRanges = ({ original, modified }: CodeRangesComparison) => {
  const allRanges = [...original, ...modified].sort(
    (a, b) => a.startLine - b.startLine,
  );
  const merged: ContentRange[] = [];

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

const useEditorBase = () => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const getContent = () => editorRef.current?.getValue() ?? '';
  const clearDirty = () => setIsDirty(false);

  return { editorRef, isDirty, setIsDirty, getContent, clearDirty };
};

export const useEditor = (filename?: string) => {
  const { editorRef, isDirty, setIsDirty, getContent, clearDirty } =
    useEditorBase();
  const language = filename
    ? getLanguageFromFilename({ filePath: filename, view: 'monaco' })
    : undefined;

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => setIsDirty(true));
  };

  return { onMount, isDirty, language, getContent, clearDirty };
};

export const useEditorBundle = () => {
  const { editorRef, isDirty, setIsDirty, getContent, clearDirty } =
    useEditorBase();

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => setIsDirty(true));
  };

  return { onMount, isDirty, getContent, clearDirty };
};

export const useViewerSelection = (file?: FileNode) => {
  const { editorRef, isDirty, setIsDirty, getContent, clearDirty } =
    useEditorBase();
  const language = file
    ? getLanguageFromFilename({ filePath: file.name, view: 'monaco' })
    : undefined;

  const getSelections = (): ContentRange[] => {
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
    getContent,
    clearDirty,
    editorRef,
  };
};
