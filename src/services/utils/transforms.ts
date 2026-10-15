import type { UserFile } from '>/contracts';

export const transformUserFiles = (userFiles: UserFile[]) =>
  userFiles.map((uf) => {
    const lastSlash = uf.filePath.lastIndexOf('/');
    const path = lastSlash === -1 ? '' : uf.filePath.slice(0, lastSlash);
    const name =
      lastSlash === -1 ? uf.filePath : uf.filePath.slice(lastSlash + 1);

    return {
      path,
      name,
      ...(uf.startLine != null && uf.endLine != null
        ? { ranges: [{ startLine: uf.startLine, endLine: uf.endLine }] }
        : {}),
    };
  });
