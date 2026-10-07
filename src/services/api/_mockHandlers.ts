import { z } from 'zod';
import { dialogStoreActions } from '>/services/stores/dialogStore';
import type { LocalError, LocalErrorTypes } from '>/types';

const createManifestError = (
  msg: string,
  type: LocalErrorTypes,
): LocalError => ({
  error: type,
  name: 'ERR_MANIFEST',
  message: msg,
});

const ManifestErrorSchema = z.object({
  error: z.literal('resource'),
  name: z.literal('ERR_MANIFEST'),
  message: z.string(),
});

const localErrorSchemas = [
  {
    type: 'resource' as const,
    schema: ManifestErrorSchema,
    resolver: createManifestError,
  },
];

const customErrorResolver = (e: unknown) => {
  for (const item of localErrorSchemas) {
    const result = item.schema.safeParse(e);

    if (result.success) {
      const error = item.resolver(result.data.message, item.type);
      dialogStoreActions.setError(error);
      return;
    }
  }

  throw new Error(String(e));
};

export const handleLocalRequests = async <T>(
  fn: () => Promise<T>,
): Promise<T | undefined> => {
  try {
    const result = await fn();
    return result;
  } catch (e: unknown) {
    customErrorResolver(e);
  }
};
