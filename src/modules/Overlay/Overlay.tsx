import { ReactNode } from 'react';

type ScreenLoaderProps = { children?: ReactNode; local?: boolean };

export const ScreenLoader = ({
  children,
  local = false,
}: ScreenLoaderProps) => {
  return (
    <div
      className={`overlay-wrapper animate-[fadeIn_0.2s_ease-in-out] ${local ? 'absolute inset-0' : 'fixed z-50 inset-0'}`}
    >
      <div className='content'>
        <div className='spinner' />
        {children}
      </div>
    </div>
  );
};
