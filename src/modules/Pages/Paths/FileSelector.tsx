import { useNavigate } from 'react-router';
import { FilePenIcon, DeleteIcon } from 'lucide-react';
import { routes } from '>/config';
import { CheckboxField } from '>/modules';
import type { FilesByFolder, FileNode, CodeRange } from '>/types';
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
    addSelectedFile,
  } = useCodeStore(({ state, api }) => ({
    selectedFiles: state.selectedFiles,
    addSelectedFiles: api.addSelectedFiles,
    removeSelectedFiles: api.removeSelectedFiles,
    setActiveFile: api.setActiveFile,
    addSelectedFile: api.addSelectedFile,
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

  const onRangeRemove = (file: FileNode, range: CodeRange) => {
    const ranges = (file.ranges ?? []).filter(
      (item) =>
        item.startLine !== range.startLine || item.endLine !== range.endLine,
    );

    addSelectedFile({
      ...file,
      ranges: ranges.length > 0 ? ranges : undefined,
    });
  };

  return (
    <div className='selection-list'>
      {Object.entries(filesByFolder).map(([folder, files], idx) => {
        const folderFiles: FileNode[] = files.map((name) => {
          const selectedFile = selectedFiles.find(
            (selected) => selected.path === folder && selected.name === name,
          );
          return {
            path: folder,
            name,
            ranges: selectedFile?.ranges,
            mode: 'code',
          };
        });

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
                {folderFiles.map((file, idxf) => {
                  const fileBoxClass = `${file.ranges ? 'light-borders -ml-3' : ''}`;
                  return (
                    <div
                      className={fileBoxClass}
                      key={`${file.path}-${file.name}-${idxf}`}
                    >
                      <div className='inline-wrapper'>
                        <button
                          className='btn-square'
                          onClick={() => onEdit(file)}
                          title='View file and select code lines'
                        >
                          <FilePenIcon size={14} />
                        </button>
                        <FileItem name={file.name} path={file.path} />
                      </div>
                      <div className='space-y-1'>
                        {file.ranges?.map((range, idxl) => (
                          <div
                            className='inline-wrapper line-sm'
                            key={`${file.path}-${file.name}-lines-${idxf}-${idxl}`}
                          >
                            <button
                              title='Remove lines of code from bundle'
                              className='btn-square error rotate-180'
                              onClick={() => onRangeRemove(file, range)}
                            >
                              <DeleteIcon size={14} />
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
  );
};
