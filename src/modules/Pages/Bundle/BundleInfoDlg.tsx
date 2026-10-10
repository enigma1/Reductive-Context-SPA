// src/modules/Pages/Bundle/BundleInfoDlg.tsx
import { useGetBundle } from '>/services/queryHooks';

type BundleInfoDlgProps = {
  bundleId: number;
};

export const BundleInfoDlg = ({ bundleId }: BundleInfoDlgProps) => {
  const { data, isLoading } = useGetBundle({ bundleId });

  return (
    <div className='area-container'>
      <div className='area-spacer'>
        <h1 className='area-title'>Bundle Information</h1>
      </div>
      <div className='area-content'>
        {isLoading ? (
          <p className='p-2 stand'>Loading bundle information...</p>
        ) : (
          <div className='p-2'>
            <p>
              <strong>Bundle ID:</strong> {data?.bundleId}
            </p>
            <p>
              <strong>Input Tokens:</strong> {data?.inputTokens}
            </p>
            <p>
              <strong>Output Tokens:</strong> {data?.outputTokens}
            </p>
            <div className='mt-2'>
              <strong>Bundle Content:</strong>
              <pre className='p-2 bg-gray-100 rounded'>
                {data?.bundleContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
