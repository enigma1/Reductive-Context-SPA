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
} from 'lucide-react';
import { routes } from '>/config';
import { useCodeStore } from '>/services/stores';
import { useReadFile } from '>/services/queryHooks';
import { useViewerSelection } from '>/services/hooks';
import { ScreenLoader } from '>/modules';

export const Reader = () => {
  const navigate = useNavigate();
  const { activeFile, addSelectedFile, setActiveFile } = useCodeStore(
    ({ api }) => ({
      activeFile: api.getActiveFile(),
      setActiveFile: api.setActiveFile,
      addSelectedFile: api.addSelectedFile,
    }),
  );

  const { code, isFetching, refetch } = useReadFile(
    activeFile,
    ({ state, query }) => ({
      code: state.code,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { onMount, getSelections, language, isDirty } =
    useViewerSelection(activeFile);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy || !activeFile) return <ScreenLoader />;

  const onGoBack = () => {
    navigate(routes.front.pathsView, { replace: true });
  };

  const onRefresh = () => {
    refetch();
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
              title='Refresh Paths'
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
          </div>
        </div>
      </div>
      <div className='page-content'>
        <Editor
          onMount={onMount}
          value={code}
          language={language}
          theme='vs-dark'
          options={{
            readOnly: true,
            domReadOnly: true,
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: true,
          }}
        />
      </div>
    </>
  );
};
