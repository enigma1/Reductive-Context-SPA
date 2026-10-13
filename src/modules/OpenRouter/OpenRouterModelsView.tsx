import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { createContextTableStore } from '>/services/stores';
import { useOpenRouterModels } from '>/services/queryHooks';
import {
  ScreenLoader,
  EffectiveTableWrapper,
  TableContainer,
  PageHeader,
  FilterColumns,
  EmptyPage,
} from '>/modules';
import type { ViewRow, JsonArray } from '>/types';

export const OpenRouterModelsView = () => {
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const tableStore = useMemo(() => createContextTableStore({}), []);
  const navigate = useNavigate();

  const { models, isFetching } = useOpenRouterModels(
    undefined,
    ({ state, query }) => ({
      models: state.models,
      isFetching: query.isFetching,
    }),
  );

  const columnsOrder = [
    'id for AI_MODEL',
    'name',
    'supported_parameters',
    'description',
    'context_length',
    'architecture',
    'pricing',
  ];

  const viewRows: ViewRow<JsonArray>[] = useMemo(() => {
    return models
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((model, idx) => ({
        row: [
          model.id,
          model.name,
          model.supported_parameters?.join(', ') ?? null,
          model.description ?? null,
          model.context_length ?? null,
          model.architecture?.modality ?? null,
          model.pricing ? JSON.stringify(model.pricing) : null,
        ],
        uiKey: model.id,
        offset: idx,
      }));
  }, [models]);

  const shellHandlers = {};

  const isBusy = isFetching;
  if (isBusy) return <ScreenLoader />;

  if (viewRows.length === 0) {
    return <EmptyPage note='No Open Router models found' />;
  }

  return (
    <>
      <PageHeader
        store={tableStore}
        title='Open Router use the id after openai-compatible:'
        expansionRef={tableRef}
        actions={shellHandlers}
        indicators={{ hasHiddenColumns: false }}
      />
      <EffectiveTableWrapper
        outerRef={outerRef}
        resizeLineRef={resizeLineRef}
        tableRef={tableRef}
      >
        <TableContainer
          rows={viewRows}
          columnsOrder={columnsOrder}
          activeCols={columnsOrder}
          store={tableStore}
          outerRef={outerRef}
          tableRef={tableRef}
          resizeLineRef={resizeLineRef}
        />
      </EffectiveTableWrapper>
    </>
  );
};
