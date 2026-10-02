import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ServerPlusIcon, SquareXIcon } from 'lucide-react';
import { routes } from '>/config';
import { cx } from '>/services/utils';
import { useSimpleForm, useModal } from '>/services/hooks';
import {
  useDialogStore,
  codeStoreActions,
  formsStoreActions,
} from '>/services/stores';
import {
  InputField,
  DialogContent,
  ErrorDetails,
  ComboField,
  TextAreaField,
} from '>/modules';
import type { FolderPath } from '>/contracts';
import type { CommonDialogHandlers } from '>/types';

// const blankPath = (path = '') => ({ id: crypto.randomUUID(), path });
const blankPath = (path = '') => ({ path });
const getFormInitialPaths = () => {
  const paths = codeStoreActions.getCurrentPaths();
  return paths.length > 0
    ? paths.map(({ path }) => blankPath(path))
    : [blankPath()];
};

type PathPresets = {
  paths: FolderPath[];
};
type FilePathsFormProps = {
  formHandlers: CommonDialogHandlers;
};

export const FilePathsForm = ({ formHandlers }: FilePathsFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useSimpleForm(
    {
      paths: getFormInitialPaths(),
      prompt: codeStoreActions.getActivePrompt(),
    },
    { autoTouch: true },
  );
  const { setButtonStatus } = useModal();
  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  const handleError = () => {
    clearError();
  };

  const onAddPath = () => {
    form.setValue('paths', [...form.values.paths, blankPath()]);
  };

  const onRemovePath = (idx: number) => {
    form.setValue(
      'paths',
      form.values.paths.filter((_, i) => i !== idx),
    );
  };

  const onConfirm = async () => {
    form.saveProfile();
    codeStoreActions.setCurrentPaths(form.values.paths);
    codeStoreActions.setActivePrompt(form.values.prompt);

    if (location.pathname !== routes.front.pathsView) {
      navigate(routes.front.pathsView);
    }
  };

  useEffect(() => {
    const allFilled = form.values.paths.every((p) => p.path.trim() !== '');
    const promptValid = form.values.prompt.trim().length >= 10;
    const disabled = errorResponse || !allFilled || !promptValid;
    const incomplete = false;
    setButtonStatus(
      'confirm',
      incomplete ? 'incomplete' : disabled ? 'disabled' : undefined,
    );
  }, [form.values, errorResponse]);

  useEffect(() => {
    formHandlers.confirm = onConfirm;
  }, [onConfirm]);
  const pathsChanged = form.isFieldTouched('paths');

  const getPathProfileLabel = (presets: FolderPath[]) => {
    return presets.map(({ path }) => path).join(', ');
  };

  const options = useMemo(() => {
    const presets = formsStoreActions
      .getProfile(form.profileId)
      ?.map((preset, idx) => {
        const formPresets = preset as PathPresets;

        return {
          value: String(idx),
          label: getPathProfileLabel(formPresets.paths),
        };
      });
    return presets;
  }, [form.profileId]);

  const handleChange = (option: string) => {
    const entry = formsStoreActions.getProfileEntry(
      form.profileId,
      Number(option),
    );

    if (!entry) {
      return;
    }
    const paths = entry.paths as FolderPath[];

    form.setValue(
      'paths',
      paths.map(({ path }) => blankPath(path)),
    );
  };

  const invalidPrompt = form.values.prompt.length < 10;

  return (
    <div className='area-container'>
      {errorResponse && (
        <div className='animate-top-slide overflow-hidden border-b border-t'>
          <DialogContent
            className='animate-in zoom-in-95 duration-300'
            classSpacer='caption error'
            note='Query execution failed'
            onClose={handleError}
          >
            <ErrorDetails error={errorResponse} />
          </DialogContent>
        </div>
      )}

      <div
        className={cx(
          'wrapper max min-h-0 transition-all duration-300',
          errorResponse && 'opacity-40 pointer-events-none',
        )}
      >
        <div className='area-spacer'>
          <h1 className='area-title'>Set Root File Paths</h1>
          <div className='area-actions'>
            <ComboField
              id={'form-select'}
              label={'Presets:'}
              wrapLayout='inline'
              wrapClass='label-left'
              $editable={false}
              onChange={(v) => handleChange(String(v))}
              $options={options}
              $placeholder={'Set path preset'}
            />
            <div className='btn-group'>
              <button
                type='button'
                className='btn-secondary'
                onClick={onAddPath}
                title='Insert Root Path'
                disabled={form.values.paths.length > 10}
              >
                <ServerPlusIcon size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className='area-content'>
          <div>
            <TextAreaField
              label='Prompt:'
              value={form.values.prompt}
              className='text-dialog-area input border'
              onValueChange={(value) => form.setValue('prompt', value)}
              status={
                form.submitAttempted && invalidPrompt ? 'error' : undefined
              }
              notice={invalidPrompt ? 'Required' : undefined}
            />
          </div>
          {form.values.paths.map((entry, idx) => {
            const showError = pathsChanged && !entry.path.trim();
            const invalid = !entry.path.trim();

            return (
              <div key={`path-key-${idx}`} className='wrapper space-y-1'>
                <InputField
                  id={`query-input-${idx}`}
                  label={`Path-${idx + 1}:`}
                  value={entry.path}
                  title={`Path-${idx}`}
                  $status={
                    form.submitAttempted && invalid ? 'error' : undefined
                  }
                  $notice={invalid ? 'Required' : undefined}
                  onValueChange={(value) => {
                    const updatedPaths = [...form.values.paths];
                    updatedPaths[idx] = blankPath(value);
                    form.setValue('paths', updatedPaths);
                  }}
                  placeholder='Enter Path'
                />

                {form.values.paths.length > 1 && (
                  <button
                    type='button'
                    className='btn-icon'
                    onClick={() => onRemovePath(idx)}
                  >
                    <SquareXIcon size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
