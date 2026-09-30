import { useMemo } from 'react';
import { themes } from '>/config';

export const useThemeOptions = () => {
  return useMemo(() => {
    return [
      {
        label: 'Main Themes',
        options: themes.map((theme) => ({
          value: theme,
          label: theme,
        })),
      },
    ];
  }, []);
};
