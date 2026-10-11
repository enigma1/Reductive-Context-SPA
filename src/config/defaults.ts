import type {
  BasicResponse,
  TableData,
  BasicRowsShape,
  FrontRequest,
} from '>/contracts';

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

export const defaultFrontRequest: FrontRequest = {
  completed: false,
  summary: '',
  reasoning: '',
  files: [],
};

export const defaultLanguagesResponse = {
  languages: {},
};
