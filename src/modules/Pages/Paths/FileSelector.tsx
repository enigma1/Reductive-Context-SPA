import { useNavigate, NavigateOptions } from 'react-router';
import { FilePenIcon } from 'lucide-react';
import { routes } from '>/config';
import { CheckboxField } from '>/modules';
import type { FilesByFolder, FileNode } from '>/types';
import { useCodeStore } from '>/services/stores';
import { FileItem } from './FileItem';

type FileSelectorProps = {
  filesByFolder: FilesByFolder;
};

export const FileSelector = ({ filesByFolder }: FileSelectorProps) => {
  const navigate = useNavigate();
  const {
    selectedFiles,
    addSelectedFiles,
    removeSelectedFiles,
    setActiveFile,
  } = useCodeStore(({ state, api }) => ({
    selectedFiles: state.selectedFiles,
    addSelectedFiles: api.addSelectedFiles,
    removeSelectedFiles: api.removeSelectedFiles,
    setActiveFile: api.setActiveFile,
  }));

  const getFolderSelectionState = (
    files: FileNode[],
    selectedFiles: FileNode[],
  ) => {
    const selectedCount = files.filter((file) =>
      selectedFiles.some(
        (selected) =>
          selected.path === file.path && selected.name === file.name,
      ),
    ).length;

    return {
      checked: selectedCount === files.length,
      indeterminate: selectedCount > 0 && selectedCount < files.length,
    };
  };

  const onEdit = (file: FileNode) => {
    setActiveFile(file);
    navigate(routes.front.readFile);
  };

  return (
    <div className='selection-list'>
      {Object.entries(filesByFolder).map(([folder, files], idx) => {
        const folderFiles: FileNode[] = files.map((name) => ({
          path: folder,
          name,
        }));

        const { checked, indeterminate } = getFolderSelectionState(
          folderFiles,
          selectedFiles,
        );

        return (
          <div className='selection-section' key={folder}>
            <div className='selection-outer space-y-1'>
              <CheckboxField
                id={`${folder}-${idx}`}
                label={folder}
                checked={checked}
                indeterminate={indeterminate}
                onChange={(checked) => {
                  if (checked) {
                    addSelectedFiles(folderFiles);
                  } else {
                    removeSelectedFiles(folderFiles);
                  }
                }}
              />
              <div className='selection-group'>
                {folderFiles.map((file, idxf) => (
                  <div
                    key={`${file.path}-${file.name}-${idxf}`}
                    className='inline-wrapper'
                  >
                    <button
                      className='btn-square'
                      onClick={() => onEdit(file)}
                      title='Edit File'
                    >
                      <FilePenIcon size={14} />
                    </button>
                    <FileItem name={file.name} path={file.path} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
