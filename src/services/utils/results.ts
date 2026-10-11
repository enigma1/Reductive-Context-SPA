import { JsonArray, JsonTypes } from '>/types';
import { getExtensionLanguages } from '>/config';

type GetCellValueProps = {
  row: JsonArray;
  columnsOrder: string[];
  colName: string;
};
export const getCellValue = ({
  row,
  columnsOrder,
  colName,
}: GetCellValueProps): JsonTypes | undefined => {
  const index = columnsOrder.indexOf(colName);
  if (index === -1) return null;
  return row[index];
};

type SingleColumnProps = {
  rows: JsonArray[];
  columnsOrder: string[];
  field: string;
};
export const getSingleColumnFromResult = ({
  rows,
  columnsOrder,
  field,
}: SingleColumnProps) => {
  const values = rows.map((row) =>
    getCellValue({ row, columnsOrder, colName: field }),
  );
  if (values.some((v) => v === null)) {
    return [];
  }
  return values;
};

type ColumnsFromResultProps = {
  rows: JsonArray[];
  columnsOrder: string[];
  fields: string[];
};
export const getColumnsFromResult = ({
  rows,
  columnsOrder,
  fields,
}: ColumnsFromResultProps) => {
  const fieldSet = new Set(fields);

  return rows.map((row) =>
    row.map((value, index) =>
      fieldSet.has(columnsOrder[index]) ? value : null,
    ),
  );
};

type ViewType = 'monaco' | 'markdown';
type GetLanguageFromFileProps = {
  filePath: string;
  view: ViewType;
};
export const getLanguageFromFilename = ({
  filePath,
  view,
}: GetLanguageFromFileProps) => {
  const extToLanguage = getExtensionLanguages();
  const filename = filePath.split(/[\/]/).pop()?.toLowerCase() ?? '';

  if (filename === 'dockerfile') return extToLanguage['dockerfile'][view];
  if (filename === 'makefile')
    return view === 'markdown' ? 'makefile' : 'makefile';
  if (filename === '.gitignore')
    return view === 'markdown' ? 'gitignore' : 'gitignore';
  if (filename === '.env') return view === 'markdown' ? 'bash' : 'bash';

  const ext = filename.includes('.') ? (filename.split('.').pop() ?? '') : '';
  return extToLanguage[ext]?.[view] ?? 'plaintext';
};
