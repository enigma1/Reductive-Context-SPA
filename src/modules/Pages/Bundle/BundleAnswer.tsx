import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { ArrowLeftToLineIcon } from 'lucide-react';
import { useCodeStore, configStoreActions } from '>/services/stores';
import { routes } from '>/config';
import { ScreenLoader, FileBlock, MarkdownComponents } from '>/modules';
import { fixMarkdown } from '>/services/utils';

export const BundleAnswer = () => {
  const navigate = useNavigate();

  const { bundleResponse, bundleStream } = useCodeStore(({ state }) => ({
    bundleResponse: state.bundleResponse,
    bundleStream: state.bundleStream,
  }));

  const { completed, files, reasoning, summary, clarification } =
    bundleResponse;

  const onGoBack = () => {
    configStoreActions.setConversationMode('listing');
    navigate(routes.front.bundleView);
  };

  const isBusy = bundleStream === 'processing';
  if (isBusy) {
    return <ScreenLoader />;
  }

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
            {files?.map((file) => (
              <div key={file.path} className='page-section flex-1 space-y-2'>
                <FileBlock file={file} />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};
