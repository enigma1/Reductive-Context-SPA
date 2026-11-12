import { ListRestartIcon, ChevronsLeftRightEllipsisIcon } from 'lucide-react';
import { useConfigStore } from '>/services/stores';

type ListingModeProps = {
  onRefresh: () => void;
};
export const ListingMode = ({ onRefresh }: ListingModeProps) => {
  const { listMode, setListMode } = useConfigStore(({ state, api }) => ({
    listMode: state.listMode,
    setListMode: api.setListMode,
  }));

  const commonActions = (
    <>
      <button className="btn-secondary" onClick={onRefresh} title="Refresh">
        <ListRestartIcon size={24} />
      </button>
      <button
        className="btn-secondary"
        onClick={() => setListMode(listMode === 'card' ? 'table' : 'card')}
        title={
          listMode === 'card'
            ? 'Switch to table listing'
            : 'Switch into card listing'
        }
      >
        <ChevronsLeftRightEllipsisIcon
          className={listMode === 'table' ? '-rotate-90' : ''}
          size={24}
        />
      </button>
    </>
  );
  return commonActions;
};
