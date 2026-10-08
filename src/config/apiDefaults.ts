import type { BasicResponse, TableData, BasicRowsShape } from '>/contracts';

export const DUMMY_RESPONSE_MESSAGE =
  'Warning - Dummy response from mocks made';

export const defaultResponse: BasicResponse = {
  ok: false,
  message: DUMMY_RESPONSE_MESSAGE,
  aiStatus: {
    active: false,
    model: '',
  },
};

export const defaultTableResponse: TableData = {
  rows: [],
  columnsOrder: [],
};

export const defaultExtTableResponse: BasicRowsShape = {
  cols: {},
  rows: [],
  columnsOrder: [],
};
