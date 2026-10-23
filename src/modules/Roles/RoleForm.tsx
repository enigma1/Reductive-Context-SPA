import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Editor from '@monaco-editor/react';
import { CircleChevronLeftIcon } from 'lucide-react';
import { editorSimpleOptions, routes } from '>/config';
import { useGetRole } from '>/services/queryHooks';
import { useDialogStore } from '>/services/stores';
import { useEditor, useSimpleForm } from '>/services/hooks';
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
  const location = useLocation();
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState<EditorSectionKey>('roleMain');

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
    name,
    roleMain,
    contentRules,
    contentExamples,
    scopePrompt,
    scopeRules,
    scopeExamples,
  });

  const onConfirm = async () => {
    if (!name) {
      // codeStoreActions.setActiveBundleId();
      // codeStoreActions.setBundleSession();
    }
    // codeStoreActions.setCurrentPaths(form.values.paths);

    if (location.pathname !== routes.front.pathsView) {
      navigate(routes.front.pathsView);
    }
  };

  useEffect(() => {
    formHandlers.confirm = onConfirm;
  }, [onConfirm]);

  const roleMainEditor = useEditor();
  const contentRulesEditor = useEditor();
  const contentExamplesEditor = useEditor();
  const scopePromptEditor = useEditor();
  const scopeRulesEditor = useEditor();
  const scopeExamplesEditor = useEditor();

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching;
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
            {openSection === 'roleMain' && (
              <div className='area-content edit'>
                <Editor
                  onMount={roleMainEditor.onMount}
                  value={roleMain}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
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
            {openSection === 'contentRules' && (
              <div className='area-content edit'>
                <Editor
                  onMount={contentRulesEditor.onMount}
                  value={contentRules}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
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
            {openSection === 'contentExamples' && (
              <div className='area-content edit'>
                <Editor
                  onMount={contentExamplesEditor.onMount}
                  value={contentExamples}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
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
            {openSection === 'scopePrompt' && (
              <div className='area-content edit'>
                <Editor
                  onMount={scopePromptEditor.onMount}
                  value={scopePrompt}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
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
            {openSection === 'scopeRules' && (
              <div className='area-content edit'>
                <Editor
                  onMount={scopeRulesEditor.onMount}
                  value={scopeRules}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
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
            {openSection === 'scopeExamples' && (
              <div className='area-content edit'>
                <Editor
                  onMount={scopeExamplesEditor.onMount}
                  value={scopeExamples}
                  language='markdown'
                  options={{
                    ...editorSimpleOptions,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
