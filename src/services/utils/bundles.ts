import { RecommendedFile } from '>/contracts';

export const parseBundleFiles = (filesJson: string): RecommendedFile[] => {
  try {
    const parsed: unknown = JSON.parse(filesJson);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (file): file is RecommendedFile =>
        typeof file === 'object' &&
        file !== null &&
        'path' in file &&
        typeof file.path === 'string' &&
        'content' in file &&
        typeof file.content === 'string' &&
        'isNew' in file &&
        typeof file.isNew === 'boolean',
    );
  } catch {
    return [];
  }
};
