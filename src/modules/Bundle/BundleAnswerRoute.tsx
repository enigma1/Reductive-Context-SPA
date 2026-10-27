import { Navigate, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { ArrowLeftToLineIcon } from 'lucide-react';
import { useCodeStore, configStoreActions } from '>/services/stores';
import { routes } from '>/config';
import { ScreenLoader, MarkdownComponents } from '>/modules';
import { fixMarkdown } from '>/services/utils';
import { MarkdownBlock } from './MarkdownBlock';
import { BundleClarification } from './BundleClarification';

export const BundleAnswerRoute = () => {
  const navigate = useNavigate();
  const { bundleResponse, bundleStream } = useCodeStore(({ state }) => ({
    bundleResponse: state.bundleResponse,
    bundleStream: state.bundleStream,
  }));

  const { completed, files, reasoning, summary, clarification } =
    bundleResponse;

  console.log('bundleResponse', bundleResponse);

  const isBusy = bundleStream === 'processing';
  if (isBusy) {
    return <ScreenLoader />;
  }

  const isEmpty = !summary && !reasoning && !files.length && !clarification;
  if (isEmpty && bundleStream !== 'awaiting') {
    return <Navigate to={routes.front.pathsView} replace />;
  }
  const onGoBack = () => {
    if (bundleStream === 'awaiting') {
      navigate(routes.front.pathsView);
      return;
    }
    configStoreActions.setConversationMode('listing');
    navigate(routes.front.bundleView);
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
              Response Received
            </div>
          </div>
        </div>
      </div>
      <div className='page-content space-y-2'>
        {bundleStream === 'error' && (
          <div className='page-section'>Request failed</div>
        )}
        <BundleClarification />
        {(bundleStream === 'done' || bundleStream === 'idle') && (
          <>
            <div className='page-section'>
              <h2>Summary:</h2>
              {summary}
            </div>
            <div className='page-section'>
              <h2>Reasoning:</h2>
              <div className='prose max-w-none'>
                <ReactMarkdown components={MarkdownComponents}>
                  {fixMarkdown(reasoning)}
                </ReactMarkdown>
              </div>
            </div>
            <div className='page-section'>
              {files?.map((file, idx) => (
                <MarkdownBlock
                  key={`${file.path}-${idx}`}
                  file={file}
                  idx={idx}
                  totalFilesCount={files.length}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
