import type { JsonArray } from './entities';

export type DataRow = JsonArray;
export type DataRows = DataRow[];
export type ViewRow<T> = {
  row: T;
  offset: number;
};

export type DataInputProps = {
  rows: DataRows;
  columnsOrder: string[];
};
