/* File: src/modules/Containers/CustomPageHeader.tsx
  Contains title and controls for the main view of a page
*/
import { type ReactNode } from 'react';
import { SquareArrowLeftIcon } from 'lucide-react';

export type CustomPageHeaderProps = {
  title: ReactNode;
  notice?: ReactNode;
  actions?: ReactNode & { onBack?: () => void };
  backTitle?: string;
  onBack?: () => void;
};

export const CustomPageHeader = ({
  actions,
  title,
  notice,
  backTitle = 'Go Back',
  onBack,
}: CustomPageHeaderProps) => {
  return (
    <>
      <div className='page-heading mb-sep'>
        <div className='page-toolbar'>
          <div className='inline-wrapper'>
            {onBack && (
              <button className='btn-micro' onClick={onBack} title={backTitle}>
                <SquareArrowLeftIcon size={18} />
              </button>
            )}
            <div
              className='page-title'
              title={typeof title === 'string' ? title : undefined}
            >
              {title}
            </div>
          </div>
          {actions && <div className='page-actions'>{actions}</div>}
          {notice && <div className='wrapper w-full page-notice'>{notice}</div>}
        </div>
      </div>
    </>
  );
};
