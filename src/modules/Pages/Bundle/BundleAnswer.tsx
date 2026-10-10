import ReactMarkdown from 'react-markdown';
import { ArrowLeftToLineIcon, ListRestartIcon } from 'lucide-react';
import { useCodeStore } from '>/services/stores';
import { ScreenLoader, FileBlock } from '>/modules';

export const BundleAnswer = () => {
  const { bundleResponse, bundleStream } = useCodeStore(({ state }) => ({
    bundleResponse: state.bundleResponse,
    bundleStream: state.bundleStream,
  }));

  const { completed, files, reasoning, summary, clarification } =
    bundleResponse;

  const onGoBack = () => {};
  const onRefresh = () => {};

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
          <div className='page-actions'>
            <button
              className='btn-secondary'
              onClick={onRefresh}
              title='Restore Bundle'
            >
              <ListRestartIcon size={24} />
            </button>
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
              <p>{summary}</p>
            </div>
            <div className='page-section'>
              <h2>Reasoning:</h2>
              <div className='prose max-w-none'>
                <ReactMarkdown>{reasoning}</ReactMarkdown>
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
