import { useDialogStore, dialogStoreActions } from '>/services/stores';
import { DialogRenderer } from './DialogRenderer';

export const GlobalDialog = () => {
  const dialog = useDialogStore(({ state }) => state.dialog);
  return (
    <DialogRenderer dialog={dialog} onClose={dialogStoreActions.closeDialog} />
  );
};
