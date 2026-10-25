import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { BasicResponse } from '>/contracts';
import { routes } from '>/config';
import { useGetRole, useSetRole, useCreateRole } from '>/services/queryHooks';
import {
  useDialogStore,
  messageStoreActions,
  configStoreActions,
} from '>/services/stores';
import { useEditor, useSimpleForm, useModal } from '>/services/hooks';
import { cx } from '>/services/utils';
import {
  DialogContent,
  ErrorDetails,
  ScreenLoader,
  InputField,
  NumberField,
  CheckboxField,
  DropFileField,
} from '>/modules';
import { CommonDialogHandlers } from '>/types';
import { RoleEditSection } from './RoleEditSection';

type EditorSectionKey =
  | 'roleMain'
  | 'contentRules'
  | 'contentExamples'
  | 'scopePrompt'
  | 'scopeRules'
  | 'scopeExamples';

const editorSections: { key: EditorSectionKey; title: string }[] = [
  { key: 'roleMain', title: 'Main Role Description' },
  { key: 'contentRules', title: 'Content Rules' },
  { key: 'contentExamples', title: 'Content Examples' },
  { key: 'scopePrompt', title: 'Scope Prompt' },
  { key: 'scopeRules', title: 'Scope Rules' },
  { key: 'scopeExamples', title: 'Scope Examples' },
];

type RoleFormProps = {
  formHandlers: CommonDialogHandlers;
  name?: string;
};

export const RoleForm = ({ name, formHandlers }: RoleFormProps) => {
  const [openSection, setOpenSection] = useState<EditorSectionKey>('roleMain');
  const location = useLocation();
  const navigate = useNavigate();

  const { setButtonStatus } = useModal();
  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  const {
    roleMain,
    contentRules,
    contentExamples,
    scopePrompt,
    scopeRules,
    scopeExamples,
    sortOrder,
    status,
    image,
    isFetching,
  } = useGetRole({ name: name ?? '' }, ({ state, query }) => ({
    roleMain: state.roleMain,
    contentRules: state.contentRules,
    contentExamples: state.contentExamples,
    scopePrompt: state.scopePrompt,
    scopeRules: state.scopeRules,
    scopeExamples: state.scopeExamples,
    sortOrder: state.sortOrder,
    status: state.status,
    image: state.image,
    isFetching: query.isFetching,
  }));

  const form = useSimpleForm({
    isNewSet: !name,
    orgName: name,
    name,
    roleMain,
    contentRules,
    contentExamples,
    scopePrompt,
    scopeRules,
    scopeExamples,
    image,
    sortOrder,
    status,
  });

  const editors = [
    useEditor(), // roleMain
    useEditor(), // contentRules
    useEditor(), // contentExamples
    useEditor(), // scopePrompt
    useEditor(), // scopeRules
    useEditor(), // scopeExamples
  ];
  const editorValues = [
    roleMain,
    contentRules,
    contentExamples,
    scopePrompt,
    scopeRules,
    scopeExamples,
  ];

  useEffect(() => {
    const disabled = errorResponse || !form.values.name;
    setButtonStatus('confirm', disabled ? 'disabled' : undefined);
  }, [form.values, errorResponse]);

  const actionMade = form.values.isNewSet ? 'creat' : 'updat';
  const callbacks = {
    onSuccess: (data: BasicResponse) => {
      if (data.ok) {
        messageStoreActions.addMessage({
          content: {
            type: 'success',
            text: `Role ${form.values.name} successfully ${actionMade}ed`,
            duration: 8000,
          },
        });
        configStoreActions.setCurrentRole(form.values.name!);
        if (location.pathname !== routes.front.roleList) {
          navigate(routes.front.roleList);
        }
      } else {
        messageStoreActions.addMessage({
          content: {
            type: 'warn',
            text: `There was a problem with ${actionMade}ing role ${form.values.name}`,
            duration: 8000,
          },
        });
      }
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `There was an error ${actionMade}ing role ${form.values.name}`,
          duration: 8000,
        },
      });
    },
  };

  const { mutate: mutateCreateRole, isPending: isCreateRolePending } =
    useCreateRole(
      ({ query, api }) => ({
        mutate: api.mutate,
        isPending: query.isPending,
      }),
      callbacks,
    );

  const { mutate: mutateUpdateRole, isPending: isSetRolePending } = useSetRole(
    ({ query, api }) => ({
      mutate: api.mutate,
      isPending: query.isPending,
    }),
    callbacks,
  );

  const onConfirm = async () => {
    const { isNewSet, orgName, name, ...params } = form.values;
    if (!name) return;

    const editorValues = editorSections.reduce(
      (acc, section, idx) => ({
        ...acc,
        [section.key]: editors[idx].getContent() ?? params[section.key],
      }),
      {},
    );

    const payload = {
      ...params,
      ...editorValues,
      name,
    };

    if (isNewSet) {
      mutateCreateRole(payload);
      return;
    }

    if (!orgName) return;

    mutateUpdateRole({ ...payload, orgName });
  };

  useEffect(() => {
    formHandlers.confirm = onConfirm;
  }, [onConfirm]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isSetRolePending || isCreateRolePending;
  if (isBusy) return <ScreenLoader />;

  const handleError = () => {
    clearError();
  };

  const toggleSection = (section: EditorSectionKey) => {
    setOpenSection((prev) => (prev === section ? prev : section));
  };

  return (
    <div className='area-container'>
      {errorResponse && (
        <div className='animate-top-slide overflow-hidden border-b border-t'>
          <DialogContent
            className='animate-in zoom-in-95 duration-300'
            classSpacer='caption error'
            note='Reading Files to compare failed'
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
          <h1 className='area-title'>{`Role: ${name ?? 'New Role'}`}</h1>
          <div className='area-actions'>
            <CheckboxField
              id='newPathsSet'
              label='New Set:'
              checked={form.values.isNewSet}
              wrapClass='label-left'
              onChange={(checked) => {
                if (checked) {
                  form.setValue('isNewSet', true);
                } else {
                  if (!!name) form.setValue('isNewSet', false);
                }
              }}
            />
          </div>
        </div>
        <div className='area-listing gap-0'>
          <div className='area-item'>
            <div className='one-line'>
              <InputField
                id='role-name'
                label='Role Name'
                value={name}
                title={`Role Name`}
                $status={
                  form.submitAttempted && !form.values.name
                    ? 'error'
                    : undefined
                }
                $notice={form.values.name ? undefined : 'Required'}
                onValueChange={(value) => {
                  form.setValue('name', value);
                }}
                placeholder='Enter Role Name'
              />
              <NumberField
                id='sort-order'
                label='Sort:'
                value={form.values.sortOrder}
                title={`Sort Order`}
                onValueChange={(value) => {
                  form.setValue('sortOrder', value || 0);
                }}
              />
              <div className='h-full center'>
                <CheckboxField
                  id='show-role'
                  label='Show:'
                  checked={form.values.status === 1}
                  wrapClass='center'
                  wrapLayout='stack'
                  // wrapClass='label-left'
                  onChange={(checked) => {
                    if (checked) {
                      form.setValue('status', 1);
                    } else {
                      form.setValue('status', 0);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {editorSections.map((section, idx) => (
            <div
              key={section.key}
              className={cx(
                'accordion-item border-t',
                openSection === section.key && 'wrapper flex-1 min-h-40',
              )}
            >
              <RoleEditSection
                title={section.title}
                isOpen={openSection === section.key}
                onToggle={() => toggleSection(section.key)}
                value={editorValues[idx]}
                onMount={editors[idx].onMount}
              />
            </div>
          ))}
          <div className='one-line center border-t border-b p-3'>
            <DropFileField
              value={form.values.image}
              onValueChange={(value) => {
                form.setValue('image', value ?? undefined);
              }}
              containerProps={{
                className: 'center gap-2',
              }}
              inputProps={{
                accept: '.png,.jpg,.webp',
              }}
              texts={{
                title: 'Drop Image file here',
                subtitle: 'or browse for a file',
                browseButton: 'Browse...',
                replaceButton: 'Replace File',
                removeButton: 'Clear',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
