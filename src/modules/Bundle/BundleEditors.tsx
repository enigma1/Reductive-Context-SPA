import Editor from '@monaco-editor/react';
import { useEditor, useResizableSplit, useMonacoReady } from '>/services/hooks';
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
  const ready = useMonacoReady();
  const { upperHeight, containerRef, handleMouseDown } = useResizableSplit();

  if (!ready)
    return (
      <div className="h-full flex items-center justify-center">Loading…</div>
    );

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full relative overflow-hidden"
    >
      <div
        style={{ height: `${content ? upperHeight : 100}%` }}
        className="w-full overflow-hidden"
      >
        <Editor
          onMount={onPromptMount}
          value={prompt}
          language="markdown"
          options={editorOptions}
        />
      </div>
      {content && (
        <>
          <div onMouseDown={handleMouseDown} className="page-splitter-resize">
            <div className="handle" />
          </div>
          <div
            style={{ height: `${100 - upperHeight}%` }}
            className="w-full overflow-hidden"
          >
            <div className="page-title p-3">Bundled Context to Submit</div>
            <Editor
              onMount={onContentMount}
              value={content}
              language="markdown"
              options={editorOptions}
            />
          </div>
        </>
      )}
    </div>
  );
};
