import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import {
  ListRestartIcon,
  ArrowLeftToLineIcon,
  SavePlusIcon,
  FileSlidersIcon,
} from 'lucide-react';
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

  // effect for invalid bundle
  useEffect(() => {
    if (!isFetching && !bundleId) {
      navigate(routes.front.pathsView, { replace: true });
    }
  }, [bundleId, isFetching, navigate]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
  if (isBusy) {
    return <ScreenLoader />;
  }

  const onSetBundle = () => {};

  const onSubmitBundle = () => {};

  const onGoBack = () => {
    navigate(routes.front.pathsView, { replace: true });
  };

  const onRefresh = () => {
    refetch();
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
            <div className='page-title' title='Generated Bundle'>
              Viewing Bundle
            </div>
          </div>
          <div className='page-actions'>
            <button
              className='btn'
              onClick={onSubmitBundle}
              title='Submit Bundle'
            >
              <FileSlidersIcon size={24} />
            </button>

            <button
              className='btn'
              onClick={onSetBundle}
              title='Update Bundle'
              data-status={!isDirty ? 'disabled' : undefined}
            >
              <SavePlusIcon size={24} />
            </button>
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
            domReadOnly: false,
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: true,
          }}
        />
      </div>
    </>
  );
};
