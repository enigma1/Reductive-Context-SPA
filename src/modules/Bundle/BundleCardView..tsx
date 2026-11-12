import { useNavigate } from 'react-router';
import {
  useCodeStore,
  dialogStoreActions,
  messageStoreActions,
} from '>/services/stores';
import { useDeleteBundles } from '>/services/queryHooks';
import {
  dialogFactories,
  ListingMode,
  ListingPageHeader,
  Card,
} from '>/modules';
import { DeleteBundlesResponse } from '>/contracts';
import { JsonArray } from '>/types';
import { routes, BUNDLE_ID, BUNDLE_PROMPT } from '>/config';

type BundleControlProps = {
  bundleId: number;
  prompt: string;
};

export const BundleControls = ({ bundleId, prompt }: BundleControlProps) => {
  const navigate = useNavigate();
  const { activeBundleId, setActiveBundleId, setActiveFile, setBundleSession } =
    useCodeStore(({ state, api }) => ({
      activeBundleId: state.activeBundleId,
      setActiveBundleId: api.setActiveBundleId,
      setActiveFile: api.setActiveFile,
      setBundleSession: api.setBundleSession,
    }));
  const onEdit = () => {
    setActiveBundleId(bundleId);
    navigate(routes.front.bundleView);
  };

  const deleteCallbacks = {
    onSuccess: (data: DeleteBundlesResponse) => {
      setBundleSession();
      setActiveFile();
      setActiveBundleId();
    },
    onError: () => {
      messageStoreActions.addMessage({
        content: {
          text: `Delete Operation Failed.`,
          duration: 8000,
        },
      });
    },
  };

  const { isPending, mutate } = useDeleteBundles(
    ({ query, api }) => ({
      isPending: query.isPending,
      mutate: api.mutate,
    }),
    deleteCallbacks,
  );

  const onDelete = () => {
    if (isPending) return;
    const columnsOrder = [BUNDLE_ID, BUNDLE_PROMPT];
    const rows = [[bundleId, prompt]];

    const onConfirm = () => {
      dialogStoreActions.closeDialog();
      mutate({ bundleIds: [bundleId] });
    };

    dialogStoreActions.openDialog({
      payload: dialogFactories.deleteTableEntries({
        columnsOrder,
        rows,
        onConfirm,
      }),
    });
  };

  return (
    <div className="one-line no-stretch">
      <button className="btn" onClick={onEdit}>
        Edit
      </button>
      <button className="btn btn-error" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

type BundleCardViewProps = {
  onRefetch: () => void;
  getColumnValues: (columnsOrder: string[]) => JsonArray[];
};

export const BundleCardView = ({
  onRefetch,
  getColumnValues,
}: BundleCardViewProps) => {
  const dataInfo = ['bundleId', 'prompt', 'inputTokens', 'outputTokens'];
  const bundles = getColumnValues(dataInfo);

  return (
    <>
      <ListingPageHeader
        title="Existing Bundles"
        actions={<ListingMode onRefresh={onRefetch} />}
      />
      <div className="page-content">
        {bundles.length === 0 ? (
          <p className="pad">There are currently no Bundles</p>
        ) : (
          <div className="flex flex-wrap gap-4 p-3 overflow-auto w-full">
            {bundles.map(
              ([bundleId, prompt, inputTokes, outputTokens], idx) => {
                return (
                  <div
                    className="wrapper border rounded-lg overflow-hidden"
                    key={idx}
                    style={{ minWidth: '250px', flex: '1 1 250px' }}
                  >
                    <Card
                      title={`#${bundleId}`}
                      content={prompt as string}
                      controls={
                        <BundleControls
                          bundleId={bundleId as number}
                          prompt={prompt as string}
                        />
                      }
                    />
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </>
  );
};
