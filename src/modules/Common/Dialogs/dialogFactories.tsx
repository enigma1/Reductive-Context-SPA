import { ReactNode } from 'react';
import { dialogStoreActions } from '>/services/stores';
import { dialogActions } from '>/services/utils';
import { Preferences, FilePathsForm } from '>/modules';
import { DialogPayload, WizardHandlers, CommonDialogHandlers } from '>/types';
import { DialogContent } from './DialogContent';

type ConfirmationProps = {
  caption: string;
  note: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};
const confirmation = ({
  caption,
  note,
  message,
  onConfirm,
  onCancel,
}: ConfirmationProps): DialogPayload => ({
  caption,
  variant: 'warn',
  component: <DialogContent note={note}>{message}</DialogContent>,
  actions: dialogActions.confirmCancel({
    onConfirm: () => {
      dialogStoreActions.closeDialog();
      onConfirm();
    },
    onCancel: () => {
      dialogStoreActions.closeDialog();
      onCancel?.();
    },
  }),
});

const editPreferences = () => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {},
  };

  const labels = [undefined, 'Save Preferences'];
  const payload: DialogPayload = {
    initialSize: 'xl',
    caption: 'Settings',
    component: <Preferences formHandlers={handlers} />,
    variant: 'info',
    actions: dialogActions
      .confirmCancel({
        onConfirm: () => {
          handlers.confirm();
          dialogStoreActions.closeDialog();
        },
      })
      .map((control, idx) => ({
        ...control,
        label: labels[idx] ?? control.label,
      })),
  };
  return payload;
};

const setFilePaths = () => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {},
  };

  const labels = [undefined, 'Set Paths'];
  const payload: DialogPayload = {
    initialSize: 'xl',
    caption: 'Set Paths',
    component: <FilePathsForm formHandlers={handlers} />,
    variant: 'info',
    actions: dialogActions
      .enabledConfirmCancel({
        onConfirm: () => {
          handlers.confirm();
          dialogStoreActions.closeDialog();
        },
      })
      .map((control, idx) => ({
        ...control,
        label: labels[idx] ?? control.label,
      })),
  };
  return payload;
};

type Factory<TArgs> = (args: TArgs) => DialogPayload;
type DialogFactories = {
  confirmation: Factory<ConfirmationProps>;
  editPreferences: Factory<void>;
  setFilePaths: Factory<void>;
};

export const dialogFactories: DialogFactories = {
  confirmation,
  editPreferences,
  setFilePaths,
};
