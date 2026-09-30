import cloneDeep from 'lodash-es/cloneDeep';
import { type ReactNode, useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ListChevronsDownUpIcon,
  ListChevronsUpDownIcon,
} from 'lucide-react';
import { configStoreActions } from '>/services/stores';
import type { UserPrefs } from '>/contracts';
import { CommonDialogHandlers } from '>/types';
import { ThemeSelect } from './Prefs';

const sections = ['theme'] as const;

type PreferenceSection = (typeof sections)[number];
type PreferenceObject = Record<PreferenceSection, boolean>;
type PreferenceSectionProps = {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export const PreferenceSection = ({
  title,
  collapsed,
  onToggle,
  children,
}: PreferenceSectionProps) => {
  return (
    <>
      <div className='wrapper rounded-sm'>
        <div className='preference-section-header'>
          <span className='one-line'>{title}</span>

          <button
            className='btn-micro'
            onClick={onToggle}
            title={collapsed ? 'Expand section' : 'Collapse section'}
          >
            {collapsed ? (
              <ChevronLeftIcon size={16} />
            ) : (
              <ChevronDownIcon size={16} />
            )}
          </button>
        </div>
      </div>

      {!collapsed && children}
    </>
  );
};

type PreferencesProps = {
  formHandlers: CommonDialogHandlers;
};

export const Preferences = ({ formHandlers }: PreferencesProps) => {
  const [currentTrigger, setCurrentTrigger] = useState<number>(0);

  const [collapsedSections, setCollapsedSections] = useState<
    Record<PreferenceSection, boolean>
  >(
    () =>
      Object.fromEntries(
        sections.map((section) => [section, false]),
      ) as PreferenceObject,
  );

  const toggleAllSections = () => {
    const shouldCollapse = Object.values(collapsedSections).some(
      (collapsed) => !collapsed,
    );

    setCollapsedSections(
      Object.fromEntries(
        sections.map((section) => [section, shouldCollapse]),
      ) as PreferenceObject,
    );
  };
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [tempSettings, setTempSettings] = useState<UserPrefs>(() =>
    cloneDeep({
      ...configStoreActions.getPreferences(),
    }),
  );

  const onSaveSuccess = () => {
    setCurrentTrigger((count) => count + 1);
  };

  const handleModify = (props: Partial<UserPrefs>) => {
    setTempSettings({
      ...tempSettings,
      ...props,
    });
  };

  return (
    <>
      <div className='area-container'>
        <div className='area-spacer'>
          <h1 className='area-title'>Preferences</h1>
          <div className='area-actions'>
            <button
              className='btn-secondary'
              onClick={toggleAllSections}
              title='Collapse/Expand preference sections'
            >
              {Object.values(collapsedSections).every(Boolean) ? (
                <ListChevronsDownUpIcon size={24} />
              ) : (
                <ListChevronsUpDownIcon size={24} />
              )}
            </button>
          </div>
        </div>
        <p className='p-2 field-warn-bg stand'>
          Unless saved, changes made to preferences do not persist among
          different sessions.
        </p>
        <div className='area-content'>
          <PreferenceSection
            title='Theme Settings'
            collapsed={collapsedSections.theme}
            onToggle={() => toggleSection('theme')}
          >
            <ThemeSelect
              modified={tempSettings}
              onModify={handleModify}
              triggerSave={currentTrigger}
            />
          </PreferenceSection>
        </div>
      </div>
    </>
  );
};
