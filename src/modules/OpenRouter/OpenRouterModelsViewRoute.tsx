import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { createContextTableStore } from '>/services/stores';
import { useOpenRouterModels } from '>/services/queryHooks';
import {
  ScreenLoader,
  EffectiveTableWrapper,
  TableContainer,
  TablePageHeader,
  FilterColumns,
  EmptyPage,
} from '>/modules';
import type { ViewRow, JsonArray } from '>/types';
import { OpenModelsCardListing } from './OpenModelsCardListing';
import { OpenModelsTableListing } from './OpenModelsTableListing';

export const OpenRouterModelsViewRoute = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

  const shellHandlers = {};

  const isBusy = isFetching;
  if (isBusy) return <ScreenLoader />;

  if (models.length === 0) {
    return <EmptyPage note='No Open Router models found' />;
  }

  return viewMode === 'table' ? (
    <OpenModelsTableListing
      models={models}
      onToggle={() => setViewMode('cards')}
    />
  ) : (
    <OpenModelsCardListing
      models={models}
      onToggle={() => setViewMode('table')}
    />
  );
};
