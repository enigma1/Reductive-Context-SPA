import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Editor, { type OnMount } from '@monaco-editor/react';
import { BasicResponse } from '>/contracts';
import { routes, editorSimpleOptions } from '>/config';
import { useGetMcp, useSetMcp, useCreateMcp } from '>/services/queryHooks';
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
  DropIconField,
} from '>/modules';
import { CommonDialogHandlers } from '>/types';

type McpFormProps = {
  formHandlers: CommonDialogHandlers;
  name?: string;
};

export const McpForm = ({ name, formHandlers }: McpFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setButtonStatus } = useModal();
  const { errorResponse, clearError } = useDialogStore(({ state, api }) => ({
    errorResponse: state.response,
    clearError: api.clearError,
  }));

  const {
    mcpName,
    mcpTransport,
    mcpJson,
    sortOrder,
    status,
    mcpIcon,
    isFetching,
  } = useGetMcp({ name: name ?? '' }, ({ state, query }) => ({
    mcpName: state.mcpName,
    mcpTransport: state.mcpTransport,
    mcpJson: state.mcpJson,
    mcpIcon: state.mcpIcon,
    sortOrder: state.sortOrder,
    status: state.status,
    isFetching: query.isFetching,
  }));

  const form = useSimpleForm({
    isNewMcp: !name,
    orgName: name,
    mcpName,
    mcpTransport,
    mcpJson,
    mcpIcon,
    sortOrder,
    status,
  });

  useEffect(() => {
    const disabled = errorResponse || !form.values.mcpName;
    setButtonStatus('confirm', disabled ? 'disabled' : undefined);
  }, [form.values, errorResponse]);

  const { onMount, getContent, language, isDirty, clearDirty } = useEditor();

  const actionMade = form.values.isNewMcp ? 'creat' : 'updat';
  const callbacks = {
    onSuccess: (data: BasicResponse) => {
      if (data.ok) {
        messageStoreActions.addMessage({
          content: {
            type: 'success',
            text: `MCP ${form.values.mcpName} successfully ${actionMade}ed`,
            duration: 8000,
          },
        });
        configStoreActions.setCurrentMcp(form.values.mcpName!);
        if (location.pathname !== routes.front.mcpList) {
          navigate(routes.front.mcpList);
        }
      } else {
        messageStoreActions.addMessage({
          content: {
            type: 'warn',
            text: `There was a problem with ${actionMade}ing MCP ${form.values.mcpName}`,
            duration: 8000,
          },
        });
      }
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `There was an error ${actionMade}ing MCP ${form.values.mcpName}`,
          duration: 8000,
        },
      });
    },
  };

  const { mutate: mutateCreateMcp, isPending: isCreateMcpPending } =
    useCreateMcp(
      ({ query, api }) => ({
        mutate: api.mutate,
        isPending: query.isPending,
      }),
      callbacks,
    );

  const { mutate: mutateUpdateMcp, isPending: isSetMcpPending } = useSetMcp(
    ({ query, api }) => ({
      mutate: api.mutate,
      isPending: query.isPending,
    }),
    callbacks,
  );

  const onConfirm = async () => {
    const { isNewMcp, orgName, mcpName, ...params } = form.values;
    if (!mcpName) return;

    const payload = {
      ...params,
      mcpName,
    };

    if (isNewMcp) {
      mutateCreateMcp(payload);
      return;
    }

    if (!orgName) return;

    mutateUpdateMcp({ ...payload, orgName });
  };

  useEffect(() => {
    formHandlers.confirm = onConfirm;
  }, [onConfirm]);

  // ----------------
  // No-Hooks Section
  // ----------------
  const isBusy = isFetching || isSetMcpPending || isCreateMcpPending;
  if (isBusy) return <ScreenLoader />;

  const handleError = () => {
    clearError();
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
          <h1 className='area-title'>{`MCP: ${name ?? 'New'}`}</h1>
          <div className='area-actions'>
            <CheckboxField
              id='newMcp'
              label='New MCP:'
              checked={form.values.isNewMcp}
              wrapClass='label-left'
              onChange={(checked) => {
                if (checked) {
                  form.setValue('isNewMcp', true);
                } else {
                  if (!!name) form.setValue('isNewMcp', false);
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
                label='MCP Name'
                value={form.values.mcpName}
                title={`MCP Name`}
                $status={
                  form.submitAttempted && !form.values.mcpName
                    ? 'error'
                    : undefined
                }
                $notice={form.values.mcpName ? undefined : 'Required'}
                onValueChange={(value) => {
                  form.setValue('mcpName', value);
                }}
                placeholder='Enter MCP Name'
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
                  id='show-mcp'
                  label='Show:'
                  checked={form.values.status === 1}
                  wrapClass='center'
                  wrapLayout='stack'
                  // wrapClass='label-left'
                  onChange={(checked) => {
                    form.setValue('status', checked ? 1 : 0);
                  }}
                />
              </div>
            </div>
          </div>
          <div className='area-content edit'>
            <Editor
              onMount={onMount}
              value={form.values.mcpJson}
              language='json'
              options={editorSimpleOptions}
            />
          </div>
          <div className='one-line center border-t border-b p-3'>
            <DropIconField
              value={form.values.mcpIcon}
              onValueChange={(value) => {
                form.setValue('mcpIcon', value ?? undefined);
              }}
              containerProps={{ className: 'center gap-2' }}
              inputProps={{
                accept: '.png,.jpg,.webp,.svg,.gif', // ← add svg and gif
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
