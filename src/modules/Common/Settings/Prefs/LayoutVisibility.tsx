import { useConfigStore, configStoreActions } from '>/services/stores';
import { CheckboxField } from '>/modules';
import { LayoutPrefs } from '>/contracts';
import { ItemPreferenceProps } from '>/types';

type LayoutPrefDisplay = {
  label: string;
  value: string;
};

type LayoutPrefDisplayMap = {
  [K in keyof LayoutPrefs]: LayoutPrefDisplay;
};

export const LayoutVisibility = ({ onModify }: ItemPreferenceProps) => {
  const layoutPrefLabels: Record<keyof LayoutPrefs, string> = {
    showHeader: 'Show header',
    showFooter: 'Show footer',
    showLeftSide: 'Show left sidebar',
    showRightSide: 'Show right sidebar',
    showHeaderMenu: 'Show header menu',
  };
  const layoutPrefs = configStoreActions.getLayoutPrefs();

  return (
    <div className='area-item'>
      {(Object.keys(layoutPrefLabels) as Array<keyof LayoutPrefs>).map(
        (key, idx) => (
          <CheckboxField
            key={key}
            checked={layoutPrefs[key]}
            onChange={(value) => {
              configStoreActions.setLayoutPrefs({ [key]: value });
              onModify({
                layout: configStoreActions.getLayoutPrefs(),
              });
            }}
            id={`${key}-${idx}`}
            label={layoutPrefLabels[key]}
            labelClass='check-label full'
          />
        ),
      )}
    </div>
  );
};
