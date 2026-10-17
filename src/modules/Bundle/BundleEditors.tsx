import Editor from '@monaco-editor/react';
import { useEditor, useResizableSplit } from '>/services/hooks';

const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  contextmenu: true,
  domReadOnly: false,
  copyWithSyntaxHighlighting: true,
  accessibilitySupport: 'on' as const,
  occurrencesHighlight: 'off' as const,
  glyphMargin: false,
  quickSuggestions: false,
  parameterHints: { enabled: false },
  wordBasedSuggestions: 'off' as const,
  folding: true,
  renderValidationDecorations: 'off' as const,
};

type BundleEditorsProps = {
  prompt: string;
  content: string;
  onPromptMount: ReturnType<typeof useEditor>['onMount'];
  onContentMount: ReturnType<typeof useEditor>['onMount'];
};

export const BundleEditors = ({
  prompt,
  content,
  onPromptMount,
  onContentMount,
}: BundleEditorsProps) => {
  const { upperHeight, containerRef, handleMouseDown } = useResizableSplit();

  return (
    <div
      ref={containerRef}
      className='flex flex-col h-full w-full relative overflow-hidden'
    >
      <div
        style={{ height: `${upperHeight}%` }}
        className='w-full overflow-hidden'
      >
        <Editor
          onMount={onPromptMount}
          value={prompt}
          language='markdown'
          options={editorOptions}
        />
      </div>

      <div
        onMouseDown={handleMouseDown}
        className='page-splitter-resize'
        title='Drag to resize editors'
      >
        <div className='handle' />
      </div>

      <div
        style={{ height: `${100 - upperHeight}%` }}
        className='w-full overflow-hidden'
      >
        <div className='page-title p-3'>Files Context Submitted</div>
        <Editor
          onMount={onContentMount}
          value={content}
          language='markdown'
          options={editorOptions}
        />
      </div>
    </div>
  );
};
