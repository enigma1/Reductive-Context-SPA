import type { BasicResponse, TableData } from '>/contracts';

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

export const defaultListResponse: TableData = {
  rows: [],
  columnsOrder: [],
};
