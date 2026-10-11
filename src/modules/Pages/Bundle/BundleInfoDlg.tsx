/* File: src/modules/Pages/Bundle/BundleInfoDlg.tsx
  Shows information about a bundle indluding
  bundle content and tokens spent
*/
import ReactMarkdown from 'react-markdown';
import { useGetBundle } from '>/services/queryHooks';
import { ScreenLoader } from '>/modules';

type BundleInfoDlgProps = {
  bundleId: number;
};

export const BundleInfoDlg = ({ bundleId }: BundleInfoDlgProps) => {
  const { bundleContent, inputTokens, outputTokens, isFetching } = useGetBundle(
    { bundleId },
    ({ state, query }) => ({
      bundleContent: state.bundleContent,
      inputTokens: state.inputTokens,
      outputTokens: state.outputTokens,
      isFetching: query.isFetching,
    }),
  );

  const isBusy = isFetching;
  return (
    <>
      {isBusy && <ScreenLoader />}
      <div className='area-container'>
        <div className='area-spacer'>
          <h1 className='area-title'>Bundle Information</h1>
        </div>
        <div className='area-content'>
          <div className='space-y-2'>
            <p>Input Tokens: {inputTokens}</p>
            <p>Output Tokens: {outputTokens}</p>
            <div className='prose max-w-none'>
              <ReactMarkdown>{bundleContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
