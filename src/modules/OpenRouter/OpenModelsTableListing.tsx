import { useRef, useMemo } from 'react';
import { OpenRouterModel } from '>/contracts';
import { createContextTableStore } from '>/services/stores';
import {
  TablePageHeader,
  EffectiveTableWrapper,
  TableContainer,
} from '>/modules';
import { JsonArray, ViewRow } from '>/types';

type OpenModelsTableListingProps = {
  models: OpenRouterModel[];
  onToggle: () => void;
};
export const OpenModelsTableListing = ({
  models,
  onToggle,
}: OpenModelsTableListingProps) => {
  const resizeLineRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const tableStore = useMemo(() => createContextTableStore({}), []);

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

  return (
    <>
      <TablePageHeader
        store={tableStore}
        title='Open Router use the id after openai-compatible:'
        expansionRef={tableRef}
        indicators={{ hasHiddenColumns: false }}
        actions={{ onToggle }}
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
