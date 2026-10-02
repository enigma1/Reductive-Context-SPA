import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import { ListRestartIcon, ArrowLeftToLineIcon } from 'lucide-react';
import { useCodeStore } from '>/services/stores';
import { routes } from '>/config';
import { useEditorBundle } from '>/services/hooks';
import { useGetBundle } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

export const BundleView = () => {
  const navigate = useNavigate();
  const { bundleId } = useCodeStore(({ state }) => ({
    bundleId: state.activeBundleId,
  }));

  const { bundleContent, isFetching, refetch } = useGetBundle(
    { bundleId: bundleId ?? 0 },
    ({ state, query }) => ({
      bundleContent: state.bundleContent,
      isFetching: query.isFetching,
      refetch: query.refetch,
    }),
  );

  const { onMount, isDirty } = useEditorBundle();

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }

  const onGoBack = () => {
    navigate(routes.front.pathsView, { replace: true });
  };

  const onRefresh = () => {};

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
            <div className='page-title' title='Generated Bundle'>
              Viewing Bundle
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
          </div>
        </div>
      </div>
      <div className='page-content'>
        <Editor
          onMount={onMount}
          value={bundleContent}
          language={'markdown'}
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
