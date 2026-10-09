import Editor from '@monaco-editor/react';
import { useEditor } from '>/services/hooks';
import { RecommendedFile } from '>/contracts';

type FileBlockProps = {
  file: RecommendedFile;
};

export const FileBlock = ({ file }: FileBlockProps) => {
  const { onMount, language } = useEditor(file.path);
  const path = `${file.path} ${file.isNew ? '(New File)' : ''}`;
  console.log('file.content', file.content);
  return (
    <>
      <h3>{path}</h3>
      <Editor
        onMount={onMount}
        value={file.content}
        language={language}
        options={{
          readOnly: true,
          domReadOnly: true,
          automaticLayout: true,
          minimap: { enabled: false },
          contextmenu: true,
        }}
      />
    </>
  );
};
