import { useConfigStore } from '>/services/stores';
import { useThemeOptions } from '>/services/hooks';
import { MessageList, ComboField } from '>/modules';
import Logo from '>/assets/images/reductive-context-xp.svg?react';

export const HeaderTop = () => {
  const { theme, setTheme, headerVisibility } = useConfigStore(
    ({ state, api }) => ({
      theme: state.theme,
      headerVisibility: state.headerVisibility,
      setTheme: api.setTheme,
    }),
  );

  const groupedThemes = useThemeOptions();

  return (
    <>
      <div className='wrapper'>
        <MessageList mode='top' />
      </div>
      {headerVisibility && (
        <header className='app-header p-2'>
          <div className='app-logo flex items-center'>
            <Logo className='text-logo' />
          </div>
          <nav className='flex items-center gap-4'>
            <ComboField
              id='header-theme-select'
              htmlFor='header-theme-select'
              label='Theme:'
              value={theme}
              onChange={(t) => {
                setTheme(t as string);
              }}
              $groups={groupedThemes}
              $placeholder='Select Theme'
              wrapLayout='inline'
              wrapClass='label-left'
            />
          </nav>
        </header>
      )}
    </>
  );
};
