import Editor from '@monaco-editor/react';
import { ScaleIcon, CopyIcon } from 'lucide-react';
import { useEditor } from '>/services/hooks';
import { RecommendedFile } from '>/contracts';
import { dialogStoreActions } from '>/services/stores';
import { dialogFactories } from '>/modules';

type FileBlockProps = {
  file: RecommendedFile;
};
export const FileBlock = ({ file }: FileBlockProps) => {
  const { onMount, language } = useEditor(file.path);
  const path = `${file.path} ${file.isNew ? '(New File)' : ''}`;

  const onCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const onContentCompare = (file: RecommendedFile) => {
    dialogStoreActions.openDialog({
      payload: dialogFactories.contentDifferences({ file }),
    });
  };

  return (
    <>
      <div className='one-line'>
        <h4 className='wrapper py-2'>{path}</h4>
        <button className='btn-square' onClick={() => onCopy(file.content)}>
          <CopyIcon size={18} />
        </button>
        {!file.isNew && (
          <button className='btn-square' onClick={() => onContentCompare(file)}>
            <ScaleIcon size={18} />
          </button>
        )}
      </div>

      <Editor
        onMount={onMount}
        value={file.content}
        language={language}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          contextmenu: true,
          domReadOnly: false,
          copyWithSyntaxHighlighting: true,
          accessibilitySupport: 'on',
          occurrencesHighlight: 'off',
          glyphMargin: false,
          quickSuggestions: false,
          parameterHints: { enabled: false },
          wordBasedSuggestions: 'off',
          folding: true,
          renderValidationDecorations: 'off',
        }}
      />
    </>
  );
};
