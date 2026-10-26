import { useNavigate } from 'react-router';
import { DeleteIcon, EyeIcon, FolderTreeIcon } from 'lucide-react';
import { useCodeStore, dialogStoreActions } from '>/services/stores';
import { routes } from '>/config';
import {
  CheckboxField,
  TextAreaField,
  RadioFields,
  dialogFactories,
} from '>/modules';
import type { FileNode, FileMode, ContentRange } from '>/contracts';
import type { FilesByFolder } from '>/types';

const getRadioMode = (mode?: FileMode) =>
  mode === undefined ? undefined : mode === 'signature' ? '1' : '0';

type FileSelectorProps = {
  filesByFolder: FilesByFolder;
};

export const FileSelector = ({ filesByFolder }: FileSelectorProps) => {
  const navigate = useNavigate();
  const {
    selectedFiles,
    addSelectedFiles,
    removeSelectedFile,
    removeSelectedFiles,
    clearSelectedFiles,
    setViewFile,
    addSelectedFile,
    setActivePrompt,
    activePrompt,
    // getCurrentPaths,
    // getAllSelectedFiles,
  } = useCodeStore(({ state, api }) => ({
    activePrompt: state.activePrompt,
    selectedFiles: state.selectedFiles,
    addSelectedFiles: api.addSelectedFiles,
    removeSelectedFile: api.removeSelectedFile,
    removeSelectedFiles: api.removeSelectedFiles,
    clearSelectedFiles: api.clearSelectedFiles,
    setViewFile: api.setViewFile,
    addSelectedFile: api.addSelectedFile,
    setActivePrompt: api.setActivePrompt,
    // getCurrentPaths: api.getCurrentPaths,
    // getAllSelectedFiles: api.getAllSelectedFiles,
  }));

  const getFolderSelectionState = (
    files: FileNode[],
    selectedFiles: FileNode[],
  ) => {
    const selectedCount = files.filter((file) =>
      selectedFiles.some(
        (selected) =>
          selected.path === file.path &&
          selected.name === file.name &&
          selected.mode === file.mode,
      ),
    ).length;

    return {
      checked: selectedCount === files.length,
      indeterminate: selectedCount > 0 && selectedCount < files.length,
      mode:
        selectedCount === 0 || selectedCount !== files.length
          ? undefined
          : files[0].mode,
    };
  };

  const getRootSelectionMode = (): FileMode | undefined => {
    if (selectedFiles.length === 0) return undefined;

    const firstMode = selectedFiles[0].mode;
    return selectedFiles.every((file) => file.mode === firstMode)
      ? firstMode
      : undefined;
  };

  const onEdit = (file: FileNode) => {
    setViewFile(file);
    navigate(routes.front.readFile);
  };

  const onRangeRemove = (file: FileNode, range: ContentRange) => {
    const ranges = (file.ranges ?? []).filter(
      (item) =>
        item.startLine !== range.startLine || item.endLine !== range.endLine,
    );

    addSelectedFile({
      ...file,
      ranges: ranges.length > 0 ? ranges : undefined,
    });
  };

  const onSetFile = (file: FileNode, mode?: string) => {
    if (mode === undefined) {
      removeSelectedFile(file);
      return;
    }
    addSelectedFile({
      ...file,
      mode: (Number(mode) === 0 ? 'content' : 'signature') as FileMode,
    });
  };

  const onSetGroup = (files: FileNode[], mode?: string) => {
    if (mode === undefined) {
      removeSelectedFiles(files);
      return;
    }

    const groupFiles = files.map((file) => ({
      ...file,
      mode: (Number(mode) === 0 ? 'content' : 'signature') as FileMode,
    }));
    addSelectedFiles(groupFiles);
  };

  const onSetAll = (mode?: string) => {
    if (mode === undefined) {
      clearSelectedFiles();
      return;
    }

    let allFiles: FileNode[] = [];
    Object.entries(filesByFolder).map(([folder, files]) => {
      files.map((name) => {
        const selectedFile = selectedFiles.find(
          (selected) => selected.path === folder && selected.name === name,
        );
        allFiles.push({
          path: folder,
          name,
          ranges: selectedFile?.ranges,
          mode: Number(mode) === 0 ? 'content' : 'signature',
        });
      });
    });
    clearSelectedFiles();
    addSelectedFiles(allFiles);
  };

  const onShowTextTree = () => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.showTextTree(),
    });
  };

  const topMode = getRootSelectionMode();

  return (
    <>
      <div className='my-2'>
        <TextAreaField
          id='prompt-field'
          label='Prompt:'
          value={activePrompt}
          className='text-dialog-area input border'
          onValueChange={(value) => setActivePrompt(value)}
          placeholder='Enter your prompt'
        />
      </div>
      <div className='selection-list'>
        <div className='selection-section inline-wrapper'>
          <div className='selection-outer'>
            <RadioFields
              label='Select All/None with Content/Signature'
              value={getRadioMode(topMode)}
              wrapLayout='inline'
              onChange={onSetAll}
            />
          </div>
          <div className='ml-auto flex gap-2'>
            <CheckboxField
              id='treeInclude'
              label='Tree:'
              checked={true}
              wrapClass='label-left'
              onChange={(checked) => {
                if (checked) {
                } else {
                }
              }}
            />
            <button className='btn-square' onClick={onShowTextTree}>
              <FolderTreeIcon size={16} />
            </button>
          </div>
        </div>
        {Object.entries(filesByFolder).map(([folder, files], idx) => {
          const folderFiles: FileNode[] = files.map((name) => {
            const selectedFile = selectedFiles.find(
              (selected) => selected.path === folder && selected.name === name,
            );
            return {
              path: folder,
              name,
              ranges: selectedFile?.ranges,
              mode: selectedFile?.mode,
            };
          });

          const { mode } = getFolderSelectionState(folderFiles, selectedFiles);

          return (
            <div className='selection-section' key={`${folder}-${idx}`}>
              <div className='selection-outer'>
                <div className='inline-wrapper'>
                  <RadioFields
                    label={folder}
                    wrapLayout='inline'
                    value={getRadioMode(mode)}
                    onChange={(mode) => onSetGroup(folderFiles, mode)}
                  />
                </div>
                <div className='selection-group'>
                  {folderFiles.map((file, idxf) => {
                    const fileBoxClass = `${file.ranges ? 'light-borders' : ''}`;

                    return (
                      <div
                        className={`${fileBoxClass} selection-outer`}
                        key={`${file.path}-${file.name}-${idxf}`}
                      >
                        <div className='inline-wrapper'>
                          <button
                            className='btn-micro'
                            onClick={() => onEdit(file)}
                            title='View file and select code lines'
                          >
                            <EyeIcon size={14} />
                          </button>
                          <RadioFields
                            label={file.name}
                            wrapLayout='inline'
                            value={getRadioMode(file.mode)}
                            onChange={(mode) => onSetFile(file, mode)}
                          />
                        </div>
                        <div className='space-y-1'>
                          {file.ranges?.map((range, idxl) => (
                            <div
                              className='inline-wrapper line-sm'
                              key={`${file.path}-${file.name}-lines-${idxf}-${idxl}`}
                            >
                              <button
                                title='Remove lines of code from bundle'
                                className='btn-micro error'
                                onClick={() => onRangeRemove(file, range)}
                              >
                                <DeleteIcon className='rotate-180' size={14} />
                              </button>
                              <span>{`Lines: [${range.startLine}-${range.endLine}]`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
