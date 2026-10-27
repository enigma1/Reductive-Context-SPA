/* File src/modules/Pages/FileReader/FileRead.tsx
  Reads a code file and shows it's contents
  Can merge code differences
*/
import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import {
  ListRestartIcon,
  CombineIcon,
  ArrowLeftToLineIcon,
  SaveCheckIcon,
} from 'lucide-react';
import { WriteFileResponse } from '>/contracts';
import { routes, editorOptions } from '>/config';
import {
  useCodeStore,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import { useReadFile, useWriteFile } from '>/services/queryHooks';
import { useViewerSelection } from '>/services/hooks';
import { ScreenLoader } from '>/modules';
import { ApiError } from '>/types';

export const Reader = () => {
  const navigate = useNavigate();
  const { activeFile, addSelectedFile, setActiveFile } = useCodeStore(
    ({ api, state }) => ({
      activeFile: state.activeFile,
      setActiveFile: api.setActiveFile,
      addSelectedFile: api.addSelectedFile,
    }),
  );

  const { code, isFetching, refetch } = useReadFile(
    activeFile,
    ({ state, query }) => ({
      code: state.content,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { onMount, getContent, getSelections, language, isDirty, clearDirty } =
    useViewerSelection(activeFile);

  const writeCallbacks = {
    onSuccess: (data: WriteFileResponse) => {
      clearDirty();
      messageStoreActions.addMessage({
        content: {
          text: `File ${activeFile?.name} written successfully.`,
          duration: 5000,
        },
      });
    },
    onError: (error: unknown) => {
      dialogStoreActions.setError(error as ApiError);
      messageStoreActions.addMessage({
        content: {
          text: `Write Operation Failed. Please check if file ${activeFile} exists and if it's writable.`,
          duration: 5000,
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

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isPendingWriting;
  if (isBusy || !activeFile) return <ScreenLoader />;

  const onGoBack = () => {
    navigate(routes.front.pathsView, { replace: true });
  };

  const onRefresh = () => {
    clearDirty();
    refetch();
  };

  const onSaveFile = () => {
    if (!activeFile) return;
    mutateWriting({ ...activeFile, content: getContent() });
  };

  const updateCodeLines = () => {
    const selectedLines = getSelections();

    const modifiedFile = {
      ...activeFile,
      ranges: [...selectedLines],
    };
    addSelectedFile(modifiedFile);
    setActiveFile();
    navigate(routes.front.pathsView, { replace: true });
  };

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='inline-wrapper'>
            <button
              className='btn-micro'
              title='Back to the File List'
              onClick={onGoBack}
            >
              <ArrowLeftToLineIcon size={18} />
            </button>
            <div
              className='page-title'
              title={`${activeFile.path}/${activeFile.name}`}
            >
              Viewing: {activeFile.name}
            </div>
          </div>
          <div className='page-actions'>
            <button
              className='btn-secondary'
              onClick={onRefresh}
              title={`Refetch ${activeFile.name}`}
            >
              <ListRestartIcon size={24} />
            </button>
            <button
              className='btn'
              onClick={updateCodeLines}
              title='Include Selected Code Lines'
              data-status={!isDirty ? 'disabled' : undefined}
            >
              <CombineIcon size={24} />
            </button>
            <button
              className='btn'
              onClick={onSaveFile}
              title='Save File'
              data-status={!isDirty ? 'disabled' : undefined}
            >
              <SaveCheckIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className='page-content'>
        <Editor
          onMount={onMount}
          value={code}
          language={language}
          options={{
            ...editorOptions,
          }}
        />
      </div>
    </>
  );
};
