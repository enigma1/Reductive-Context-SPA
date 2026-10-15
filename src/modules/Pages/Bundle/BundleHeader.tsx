import {
  ListRestartIcon,
  SavePlusIcon,
  FileSlidersIcon,
  ChevronsLeftRightEllipsisIcon,
} from 'lucide-react';
import { useConfigStore } from '>/services/stores';

type BundleHeaderProps = {
  hasConversations: boolean;
  onRefresh: () => void;
  onSubmitBundle: () => void;
  isDirty: boolean;
};

export const BundleHeader = ({
  hasConversations,
  onRefresh,
  onSubmitBundle,
  isDirty,
}: BundleHeaderProps) => {
  const { conversationMode, setConversationMode } = useConfigStore(
    ({ state, api }) => ({
      conversationMode: state.conversationMode,
      setConversationMode: api.setConversationMode,
    }),
  );

  const firstActions = (
    <>
      <button className='btn' onClick={onSubmitBundle} title='Submit Bundle'>
        <FileSlidersIcon size={24} />
      </button>
    </>
  );

  const switchNote =
    conversationMode === 'listing'
      ? 'Switch To Conversation'
      : 'Switch to Original Prompt';

  const commonActions = (
    <>
      <button className='btn-secondary' onClick={onRefresh} title='Refresh'>
        <ListRestartIcon size={24} />
      </button>
      <button
        className='btn-secondary'
        onClick={() =>
          setConversationMode(
            conversationMode === 'initial' ? 'listing' : 'initial',
          )
        }
        title={switchNote}
        data-status={!hasConversations ? 'disabled' : undefined}
      >
        <ChevronsLeftRightEllipsisIcon size={24} />
      </button>
    </>
  );

  const actions =
    conversationMode === 'listing' ? (
      commonActions
    ) : (
      <>
        {firstActions}
        {commonActions}
      </>
    );

  return actions;
};
