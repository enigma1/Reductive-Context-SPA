/* File: src/services/utils/tables.ts
  Utility functions for table JSX components
*/
import type { DataRows, JsonArray, JsonObject } from '>/types';

export const getMergedSimpleColumnData = (
  row: JsonArray,
  editedColumns?: JsonObject,
) => {
  if (!editedColumns) return row;

  const mergedData = [...row];
  Object.entries(editedColumns).forEach(([index, value]) => {
    mergedData[Number(index)] = value;
  });
  return mergedData;
};

export const intoViewRows = (rows: DataRows, offset?: number) =>
  rows.map((r, idx) => ({
    offset: idx + (offset ?? 0),
    row: r,
  }));
