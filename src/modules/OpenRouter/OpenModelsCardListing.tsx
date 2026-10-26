import { TableIcon } from 'lucide-react';
import { OpenRouterModel } from '>/contracts';
import { ListingPageHeader, Card } from '>/modules';

type ToggleButtonProps = {
  onToggle: () => void;
};
const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  return (
    <button
      className='btn-secondary'
      onClick={onToggle}
      title='Switch into Table View'
    >
      <TableIcon size={24} />
    </button>
  );
};

type OpenModelsCardListingProps = {
  models: OpenRouterModel[];
  onToggle: () => void;
};

export const OpenModelsCardListing = ({
  models,
  onToggle,
}: OpenModelsCardListingProps) => {
  return (
    <>
      <ListingPageHeader
        title='Open Router use the id after openai-compatible:'
        actions={<ToggleButton onToggle={onToggle} />}
      />
      <div className='page-content'>
        <div className='flex flex-wrap gap-4 p-3 overflow-auto w-full'>
          {models.map((model, idx) => {
            const content = (
              <div className='flex flex-col gap-2'>
                <div className='text-sm text-gray-500'>Name: {model.name}</div>
                {model.description && (
                  <p className='text-sm'>{model.description}</p>
                )}
                <div className='text-xs flex flex-wrap gap-2 text-gray-400'>
                  {model.context_length && (
                    <span>Context: {model.context_length}</span>
                  )}
                  {model.architecture?.modality && (
                    <span>Modality: {model.architecture.modality}</span>
                  )}
                </div>
              </div>
            );

            return (
              <div
                className='wrapper border rounded-lg overflow-hidden'
                key={model.id || idx}
                style={{ minWidth: '280px', flex: '1 1 280px' }}
              >
                <Card title={`#${model.id}`} content={content} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
