import ReactMarkdown from 'react-markdown';
import { useCodeStore } from '>/services/stores';
import { MarkdownComponents } from '>/modules';
import { fixMarkdown } from '>/services/utils';

export const BundleClarification = () => {
  const { bundleResponse, bundleStream } = useCodeStore(({ state }) => ({
    bundleResponse: state.bundleResponse,
    bundleStream: state.bundleStream,
  }));
  const { clarification } = bundleResponse;

  return (
    <>
      {bundleStream === 'awaiting' && clarification ? (
        <div className='page-section field-warn-bg py-2'>
          <h2>Clarification Needed:</h2>
          <div className='prose max-w-none'>
            <ReactMarkdown components={MarkdownComponents}>
              {fixMarkdown(clarification)}
            </ReactMarkdown>
          </div>
        </div>
      ) : null}
    </>
  );
};
