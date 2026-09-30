import { CheckboxField } from '>/modules';
import { codeStoreActions } from '>/services/stores';

type FileItemProps = {
  name: string;
  path: string;
};

export const FileItem = ({ name, path }: FileItemProps) => {
  const filepath = `${path}.${name}`;
  return (
    <div className='file-item space-y-2'>
      <CheckboxField
        id={`${filepath}`}
        label={name}
        checked={codeStoreActions.isSelectedFile({ path, name })}
        onChange={(checked) => {
          if (checked) {
            codeStoreActions.addSelectedFile({ path, name });
          } else {
            codeStoreActions.removeSelectedFile({ path, name });
          }
        }}
      />
    </div>
  );
};
