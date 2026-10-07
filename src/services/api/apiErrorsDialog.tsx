import { dialogStoreActions } from '>/services/stores';
import { dialogActions } from '>/services/utils';
import { DialogContent } from '>/modules';
import { ApiError } from '>/types';

type ApiErrorContext = 'query' | 'mutation' | 'stream';
export const handleApiError = (error: ApiError, context: ApiErrorContext) => {
  console.error(context, error);
  const isActive = dialogStoreActions.getActive();

  if (isActive) {
    dialogStoreActions.setError(error);
    return;
  }

  const caption = context === 'mutation' ? 'Action Failed' : 'General Error';
  const note = context === 'mutation' ? 'Action Request Error' : 'Stream Error';

  dialogStoreActions.openDialog({
    payload: {
      caption,
      component: (
        <DialogContent note={note}>
          <h3>{error.error}</h3>
          <p className='text-sm'>{error.message}</p>
          {error.details && (
            <ul>
              {error.details.map((d, idx) => (
                <li key={`context-error-${idx}`}>{d}</li>
              ))}
            </ul>
          )}
        </DialogContent>
      ),
      actions: dialogActions.ack(),
    },
  });
};
