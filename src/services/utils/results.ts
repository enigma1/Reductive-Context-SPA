import { JsonArray, JsonTypes } from '>/types';

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
