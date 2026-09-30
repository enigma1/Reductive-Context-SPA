/* File src/modules/Pages/FileReader/FileRead.tsx
  Reads a code file and shows it's contents
  Can merge code differences
*/
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import { ListRestartIcon, CombineIcon } from 'lucide-react';
import { routes } from '>/config';
import { useCodeStore, messageStoreActions } from '>/services/stores';
import { useReadFile } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

const getMonacoLanguage = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    default:
      return 'plaintext';
  }
};

export const Reader = () => {
  const navigate = useNavigate();
  const { activeFile } = useCodeStore(({ state }) => ({
    activeFile: state.activeFile,
  }));

  const { code, isFetching, refetch } = useReadFile(
    activeFile,
    ({ state, query }) => ({
      code: state.code,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  useEffect(() => {
    if (!activeFile) {
      messageStoreActions.addMessage({
        content: {
          text: 'No active file specified',
          duration: 4000,
        },
      });
      navigate(routes.front.filesView, { replace: true });
    }
    if (code.length < 4) {
      messageStoreActions.addMessage({
        content: {
          text: 'File length too small',
          duration: 4000,
        },
      });
      navigate(routes.front.filesView, { replace: true });
    }
  }, [code, activeFile, navigate]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy || !activeFile) return <ScreenLoader />;

  const onRefresh = () => {
    refetch();
  };

  const writeFileChanges = () => {};
  const hasChanges = false;

  return (
    <>
      <div className='page-heading'>
        <div className='page-toolbar'>
          <div className='page-title'>Select Code Lines</div>
          <div className='page-actions'>
            <button
              className='btn-secondary'
              onClick={onRefresh}
              title='Refresh Paths'
            >
              <ListRestartIcon size={24} />
            </button>
            {hasChanges && (
              <button
                className='btn'
                onClick={writeFileChanges}
                title='Accept File Changes'
              >
                <CombineIcon size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='page-content'>
        <Editor
          value={code}
          language={getMonacoLanguage(activeFile.name)}
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
