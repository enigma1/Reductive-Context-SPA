/* File: src/modules/FileReader/WriteFileDlg.tsx
  Dialog write confirmation dialog to wriate file content
  Can edit file before saving
*/
import { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { RecommendedFile, WriteFileResponse } from '>/contracts';
import { useDialogStore, messageStoreActions } from '>/services/stores';
import { useWriteFile } from '>/services/queryHooks';
import { useEditor } from '>/services/hooks';
import { cx, getFileFromPath } from '>/services/utils';
import { ScreenLoader, DialogContent, ErrorDetails } from '>/modules';
import { CommonDialogHandlers } from '>/types';

type WriteFileProps = {
  recommendedFile: RecommendedFile;
  formHandlers: CommonDialogHandlers;
};

export const WriteFileDlg = ({
  recommendedFile,
  formHandlers,
}: WriteFileProps) => {
  const { onMount, language, isDirty } = useEditor(recommendedFile.path);

  const writeCallbacks = {
    onSuccess: (data: WriteFileResponse) => {
      if (data.ok) {
      } else {
      }
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `Write Operation Failed. Please check if file ${recommendedFile.path} exists and if it's writable.`,
          duration: 8000,
        },
      });
    },
  };

  const { mutate: mutateWriting, isPending: isPendingWriting } = useWriteFile(
    ({ api, query }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
    writeCallbacks,
  );

  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  const onConfirm = () => {
    const pathFile = getFileFromPath(recommendedFile.path);
    mutateWriting({
      ...pathFile,
      content: recommendedFile.content,
    });
  };

  useEffect(() => {
    formHandlers.confirm = onConfirm;
  }, [onConfirm]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isPendingWriting;
  if (isBusy) return <ScreenLoader />;

  const handleError = () => {
    clearError();
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
          <h1 className='area-title'>{`File: ${recommendedFile.path}`}</h1>
          <div className='area-actions'></div>
        </div>
        <div className='area-content'>
          <Editor
            onMount={onMount}
            value={recommendedFile.content}
            language={language}
            options={{
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
