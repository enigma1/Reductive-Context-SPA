import Editor from '@monaco-editor/react';
import { useEditorBundle, useResizableSplit } from '>/services/hooks';

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
  onPromptMount: ReturnType<typeof useEditorBundle>['onMount'];
  onContentMount: ReturnType<typeof useEditorBundle>['onMount'];
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
        className='h-2 shrink-0 bg-gray-700 hover:bg-blue-500 cursor-row-resize w-full flex items-center justify-center transition-colors select-none'
        title='Drag to resize editors'
      >
        <div className='w-8 h-1 bg-gray-400 rounded-full' />
      </div>

      <div
        style={{ height: `${100 - upperHeight}%` }}
        className='w-full overflow-hidden'
      >
        <div className='page-title p-3'>Files Context</div>
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
