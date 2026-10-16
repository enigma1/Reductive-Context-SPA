/* File: src/modules/Pages/FileReader/ContentDifferentDlg.tsx
  Dialog file shows file differences
  Can merge code differences
*/
import { useRef, useMemo, useEffect } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { RecommendedFile } from '>/contracts';
import { useDialogStore } from '>/services/stores';
import { useReadFile } from '>/services/queryHooks';
import { cx, getLanguageFromFilename, getFileFromPath } from '>/services/utils';
import { ScreenLoader, DialogContent, ErrorDetails } from '>/modules';
import { CommonDialogHandlers } from '>/types';

type ContentDifferencesProps = {
  recommendedFile: RecommendedFile;
  onMerge: () => void;
  formHandlers: CommonDialogHandlers;
};

export const ContentDifferencesDlg = ({
  recommendedFile,
  onMerge,
  formHandlers,
}: ContentDifferencesProps) => {
  const diffRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  const onMount = (editor: monaco.editor.IStandaloneDiffEditor) => {
    diffRef.current = editor;
  };

  const {
    content: contentOriginal,
    isFetching: isFetchingOriginal,
    refetch: refetchOriginal,
  } = useReadFile(
    getFileFromPath(recommendedFile.path),
    ({ state, query }) => ({
      content: state.content,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const language = useMemo(() => {
    return getLanguageFromFilename({
      filePath: recommendedFile.path,
      view: 'monaco',
    });
  }, [recommendedFile.path]);

  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  useEffect(() => {
    return () => {
      const ed = diffRef.current;
      if (ed) {
        const origModel = ed.getOriginalEditor().getModel();
        const modModel = ed.getModifiedEditor().getModel();
        ed.setModel(null);
        origModel?.dispose();
        modModel?.dispose();
      }
    };
  }, []);
  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetchingOriginal;
  if (isBusy) return <ScreenLoader />;

  const handleError = () => {
    clearError();
  };

  const onRefreshOriginal = () => {
    refetchOriginal();
  };

  return (
    <div className='area-container'>
      {errorResponse && (
        <div className='animate-top-slide overflow-hidden border-b border-t'>
          <DialogContent
            className='animate-in zoom-in-95 duration-300'
            classSpacer='caption error'
            note='Reading Files to compare failed'
            onClose={handleError}
          >
            <ErrorDetails error={errorResponse} />
          </DialogContent>
        </div>
      )}
      <div
        className={cx(
          'wrapper max min-h-0 transition-all duration-300',
          errorResponse && 'opacity-40 pointer-events-none',
        )}
      >
        <div className='area-spacer'>
          <h1 className='area-title'>Comparing Files</h1>
          <div className='area-actions'></div>
        </div>
        <div className='area-content'>
          <DiffEditor
            onMount={onMount}
            original={contentOriginal}
            modified={recommendedFile.content}
            language={language}
            options={{
              renderSideBySide: true,
              automaticLayout: true,
              minimap: { enabled: false },
              contextmenu: true,
              domReadOnly: false,
              copyWithSyntaxHighlighting: true,
              accessibilitySupport: 'on',
              occurrencesHighlight: 'off',
              glyphMargin: false,
              quickSuggestions: false,
              parameterHints: { enabled: false },
              folding: true,
              renderValidationDecorations: 'off',
            }}
          />
        </div>
      </div>
    </div>
  );
};
