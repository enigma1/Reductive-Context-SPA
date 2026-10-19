import Editor from '@monaco-editor/react';
import { useEditor, useResizableSplit } from '>/services/hooks';
import { editorOptions } from '>/config';

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
        style={{ height: `${content ? upperHeight : 100}%` }}
        className='w-full overflow-hidden'
      >
        <Editor
          onMount={onPromptMount}
          value={prompt}
          language='markdown'
          options={editorOptions}
        />
      </div>
      {content && (
        <>
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
        </>
      )}
    </div>
  );
};
