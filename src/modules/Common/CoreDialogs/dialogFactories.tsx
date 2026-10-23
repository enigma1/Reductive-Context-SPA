import { ReactNode } from 'react';
import { RecommendedFile } from '>/contracts';
import { dialogStoreActions } from '>/services/stores';
import {
  Preferences,
  FilePathsForm,
  RoleForm,
  ContentDifferencesDlg,
  WriteFileDlg,
  ActionPreview,
} from '>/modules';
import type { TableData } from '>/contracts';
import { DialogPayload, WizardHandlers, CommonDialogHandlers } from '>/types';
import { dialogActions } from './dialogActions';
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

const setRole = () => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {},
  };

  const labels = [undefined, 'Set Role'];
  const payload: DialogPayload = {
    initialSize: 'xxl',
    caption: 'Set Roles',
    component: <RoleForm formHandlers={handlers} />,
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

type ContentDifferencesProps = {
  file: RecommendedFile;
};
const contentDifferences = ({ file }: ContentDifferencesProps) => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {},
  };

  const labels = [undefined, 'Merge'];
  const payload: DialogPayload = {
    initialSize: 'xxl',
    caption: 'File Differences',
    component: (
      <ContentDifferencesDlg recommendedFile={file} formHandlers={handlers} />
    ),
    variant: 'warn',
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

type WriteFileProps = {
  file: RecommendedFile;
};
const writeFile = ({ file }: WriteFileProps) => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {},
  };

  const labels = [undefined, 'Save'];
  const payload: DialogPayload = {
    initialSize: 'xxl',
    caption: 'Review Content to Write',
    component: <WriteFileDlg recommendedFile={file} formHandlers={handlers} />,
    variant: 'warn',
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

type DeleteTableEntriesProps = TableData & {
  onConfirm: () => void;
};
const deleteTableEntries = ({
  onConfirm,
  rows,
  columnsOrder,
}: DeleteTableEntriesProps) => {
  const handlers: CommonDialogHandlers = {
    confirm: () => {
      onConfirm();
    },
  };

  const labels = [undefined, 'Confirm Removal'];
  const payload: DialogPayload = {
    initialSize: 'lg',
    caption: 'Bundles Removal',
    component: (
      <ActionPreview
        rows={rows}
        columnsOrder={columnsOrder}
        message='The following entries will be permanently removed'
      />
    ),
    variant: 'warn',
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

type Factory<TArgs> = (args: TArgs) => DialogPayload;
type DialogFactories = {
  confirmation: Factory<ConfirmationProps>;
  editPreferences: Factory<void>;
  setRole: Factory<void>;
  setFilePaths: Factory<void>;
  contentDifferences: Factory<ContentDifferencesProps>;
  writeFile: Factory<ContentDifferencesProps>;
  deleteTableEntries: Factory<DeleteTableEntriesProps>;
};

export const dialogFactories: DialogFactories = {
  confirmation,
  editPreferences,
  setRole,
  setFilePaths,
  contentDifferences,
  writeFile,
  deleteTableEntries,
};
