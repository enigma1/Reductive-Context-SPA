import type { DataRows } from '>/types';

export const intoViewRows = (rows: DataRows, offset?: number) =>
  rows.map((r, idx) => ({
    offset: idx + (offset ?? 0),
    row: r,
  }));
