import type { DialogAction } from '>/types';
import { dialogStoreActions } from '>/services/stores';

type AckProps = {
  onAck: () => void;
};

type ConfirmProps = {
  onConfirm: () => void;
  onCancel?: () => void;
};

type WizardProps = {
  onFinish: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onCancel?: () => void;
};

export const dialogActions = {
  ack: (props?: AckProps): DialogAction[] => [
    {
      label: 'OK',
      onClick: props?.onAck ?? dialogStoreActions.closeDialog,
    },
  ],
  confirmCancel: ({ onConfirm, onCancel }: ConfirmProps): DialogAction[] => [
    {
      label: 'Cancel',
      classes: 'btn-secondary',
      onClick: onCancel ?? dialogStoreActions.closeDialog,
    },
    {
      label: 'Confirm',
      classes: 'btn',
      onClick: onConfirm,
    },
  ],

  enabledConfirmCancel: ({
    onConfirm,
    onCancel,
  }: ConfirmProps): DialogAction[] => [
    {
      label: 'Cancel',
      classes: 'btn-secondary',
      onClick: onCancel ?? dialogStoreActions.closeDialog,
    },
    {
      id: 'confirm',
      label: 'Confirm',
      classes: 'btn',
      onClick: onConfirm,
      status: 'disabled',
    },
  ],

  wizard: ({
    onNext,
    onPrevious,
    onFinish,
    onCancel,
  }: WizardProps): DialogAction[] => [
    {
      label: 'Cancel',
      classes: 'btn-secondary',
      onClick: onCancel ?? dialogStoreActions.closeDialog,
    },
    {
      id: 'previous',
      label: 'Previous',
      classes: 'btn-secondary',
      onClick: onPrevious,
      status: 'hidden',
    },
    {
      id: 'next',
      label: 'Next',
      classes: 'btn',
      onClick: onNext,
      status: 'disabled',
    },
    {
      id: 'finish',
      label: 'Finish',
      classes: 'btn',
      onClick: onFinish,
      status: 'hidden',
    },
  ],
};
