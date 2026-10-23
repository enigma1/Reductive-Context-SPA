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

export const defaultResponseOk: BasicResponse = {
  ok: true,
  message: DUMMY_RESPONSE_MESSAGE,
  aiStatus: {
    active: false,
    model: '',
  },
};

export const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  contextmenu: true,
  domReadOnly: false,
  copyWithSyntaxHighlighting: true,
  accessibilitySupport: 'on' as const,
  occurrencesHighlight: 'off' as const,
  glyphMargin: false,
  quickSuggestions: false,
  parameterHints: { enabled: false },
  wordBasedSuggestions: 'off' as const,
  folding: true,
  renderValidationDecorations: 'off' as const,
};

export const editorSimpleOptions = {
  ...editorOptions,
  lineNumbers: 'off' as const,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  folding: false,
};
