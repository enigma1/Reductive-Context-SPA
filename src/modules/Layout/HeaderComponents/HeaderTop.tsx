import { useConfigStore } from '>/services/stores';
import { useThemeOptions } from '>/services/hooks';
import { ComboField } from '>/modules';

export const HeaderTop = () => {
  const { theme, setTheme } = useConfigStore(({ state, api }) => ({
    theme: state.theme,
    setTheme: api.setTheme,
  }));
  const groupedThemes = useThemeOptions();

  return (
    <ComboField
      id='header-theme-select'
      htmlFor='header-theme-select'
      value={theme}
      onChange={(t) => {
        setTheme(t as string);
      }}
      $groups={groupedThemes}
      $placeholder='Select Theme'
      wrapLayout='inline'
    />
  );
};
