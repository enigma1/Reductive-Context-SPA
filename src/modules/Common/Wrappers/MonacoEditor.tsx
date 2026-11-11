/* File: src/modules/Common/Wrappers/MonacoEditor.tsx 
  Processes option once the editor is fully loaded
  Pass a ref if a parent component needs to reach into the editor
  eg: 
    const editorRef = useRef<MonacoEditorHandle>(null);
    <MonacoEditor ref={editorRef}....
    to read the value on form submit, 
    check if it's dirty before closing a dialog, 
    or clear the dirty flag after a save.
*/
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Editor, { type OnChange } from '@monaco-editor/react';
import { useEditor } from '>/services/hooks/editor';

export type MonacoEditorHandle = {
  getValue: () => string;
  isDirty: () => boolean;
  clearDirty: () => void;
};

export type MonacoEditorProps = {
  value: string;
  language?: string;
  options?: Record<string, unknown>;
  onChange?: OnChange;
  filename?: string;
};

export const MonacoEditor = forwardRef<MonacoEditorHandle, MonacoEditorProps>(
  ({ value, language, options, onChange, filename }, ref) => {
    const { onMount, isDirty, getContent, clearDirty, ready } =
      useEditor(filename);

    useImperativeHandle(ref, () => ({
      getValue: getContent,
      isDirty: () => isDirty,
      clearDirty,
    }));

    if (!ready) {
      return (
        <div className="h-full flex items-center justify-center">
          <span className="caption">Loading Monaco Editor…</span>
        </div>
      );
    }

    return (
      <Editor
        onMount={onMount}
        value={value}
        language={language}
        options={options}
        onChange={onChange}
      />
    );
  },
);
