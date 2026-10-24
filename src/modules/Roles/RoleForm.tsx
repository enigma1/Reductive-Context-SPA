import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Editor from '@monaco-editor/react';
import { CircleChevronLeftIcon } from 'lucide-react';
import { BasicResponse } from '>/contracts';
import { editorSimpleOptions, routes } from '>/config';
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
  CheckboxField,
} from '>/modules';
import { CommonDialogHandlers } from '>/types';

type RoleFormProps = {
  formHandlers: CommonDialogHandlers;
  name?: string;
};

type EditorSectionKey =
  | 'roleMain'
  | 'contentRules'
  | 'contentExamples'
  | 'scopePrompt'
  | 'scopeRules'
  | 'scopeExamples';

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
    isFetching,
  } = useGetRole({ name: name ?? '' }, ({ state, query }) => ({
    roleMain: state.roleMain,
    contentRules: state.contentRules,
    contentExamples: state.contentExamples,
    scopePrompt: state.scopePrompt,
    scopeRules: state.scopeRules,
    scopeExamples: state.scopeExamples,
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
  });

  const roleMainEditor = useEditor();
  const contentRulesEditor = useEditor();
  const contentExamplesEditor = useEditor();
  const scopePromptEditor = useEditor();
  const scopeRulesEditor = useEditor();
  const scopeExamplesEditor = useEditor();

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

    const editorValues = {
      roleMain: roleMainEditor.getContent() ?? params.roleMain,
      contentRules: contentRulesEditor.getContent() ?? params.contentRules,
      contentExamples:
        contentExamplesEditor.getContent() ?? params.contentExamples,
      scopePrompt: scopePromptEditor.getContent() ?? params.scopePrompt,
      scopeRules: scopeRulesEditor.getContent() ?? params.scopeRules,
      scopeExamples: scopeExamplesEditor.getContent() ?? params.scopeExamples,
    };

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
    console.log('payload', payload);
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
        <div className='area-listing'>
          <div className='area-item'>
            <InputField
              id='role-name'
              label='Role Name'
              value={name}
              title={`Role Name`}
              $status={
                form.submitAttempted && !form.values.name ? 'error' : undefined
              }
              $notice={form.values.name ? undefined : 'Required'}
              onValueChange={(value) => {
                form.setValue('name', value);
              }}
              placeholder='Enter Role Name'
            />
          </div>

          {/* Accordion Section: Main Role Description */}
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('roleMain')}
            >
              <h4 className='area-subtitle'>Main Role Description</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'roleMain' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'roleMain' && 'hidden',
              )}
            >
              <Editor
                onMount={roleMainEditor.onMount}
                value={roleMain}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('contentRules')}
            >
              <h4 className='area-subtitle'>Content Rules</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'contentRules' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'contentRules' && 'hidden',
              )}
            >
              <Editor
                onMount={contentRulesEditor.onMount}
                value={contentRules}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('contentExamples')}
            >
              <h4 className='area-subtitle'>Content Examples</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'contentExamples' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'contentExamples' && 'hidden',
              )}
            >
              <Editor
                onMount={contentExamplesEditor.onMount}
                value={contentExamples}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('scopePrompt')}
            >
              <h4 className='area-subtitle'>Scope Prompt</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'scopePrompt' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'scopePrompt' && 'hidden',
              )}
            >
              <Editor
                onMount={scopePromptEditor.onMount}
                value={scopePrompt}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('scopeRules')}
            >
              <h4 className='area-subtitle'>Scope Rules</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'scopeRules' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'scopeRules' && 'hidden',
              )}
            >
              <Editor
                onMount={scopeRulesEditor.onMount}
                value={scopeRules}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
          <div className='area-item'>
            <div
              className='flex items-center justify-between cursor-pointer select-none'
              onClick={() => toggleSection('scopeExamples')}
            >
              <h4 className='area-subtitle'>Scope Examples</h4>
              <CircleChevronLeftIcon
                size={20}
                className={`icon-muted transition-transform duration-300 ${
                  openSection === 'scopeExamples' ? '-rotate-90' : ''
                }`}
              />
            </div>
            <div
              className={cx(
                'area-content edit',
                openSection !== 'scopeExamples' && 'hidden',
              )}
            >
              <Editor
                onMount={scopeExamplesEditor.onMount}
                value={scopeExamples}
                language='markdown'
                options={editorSimpleOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
