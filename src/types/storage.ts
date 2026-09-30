import type { UserPrefs } from '>/contracts';

export type ItemPreferenceProps = {
  modified: UserPrefs;
  onModify: (tempSettings: Partial<UserPrefs>) => void;
  triggerSave: number;
};
