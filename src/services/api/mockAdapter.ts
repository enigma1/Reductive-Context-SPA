import type { AxiosAdapter, AxiosResponse } from 'axios';
import { routes } from '>/config';
import { handleLocalRequests } from './_mockHandlers';

type ManifestJson = Record<string, string>;
let manifestMocks: ManifestJson | null = null;

const reverseRoutes = Object.fromEntries(
  Object.entries(routes.back).map(([key, url]) => [url, key]),
);

const getManifest = async () => {
  if (!manifestMocks) {
    const response = await handleLocalRequests(() =>
      fetch('/extras/mocks/manifest.json'),
    );
    manifestMocks = await response?.json();
  }
  return manifestMocks;
};

export const mockAdapter: AxiosAdapter = async (config) => {
  const key = `${config.method?.toUpperCase()} ${config.url}`;
  if (!config.url) {
    return Promise.reject(new Error(`Unspecified URL`));
  }
  const routeName = reverseRoutes[config.url];

  await new Promise((r) => setTimeout(r, key.includes('delayed') ? 1500 : 200));

  if (!routeName) {
    return Promise.reject(new Error(`No mock route configured for ${key}`));
  }

  const manifest = await getManifest();
  const mockUrl = manifest?.[routeName];

  if (!mockUrl) {
    return Promise.reject(
      new Error(`No mock file in manifest for '${routeName}'`),
    );
  }

  const res = await fetch(mockUrl);
  if (!res.ok) {
    return Promise.reject(new Error(`Failed to load mock file: ${mockUrl}`));
  }
  const data = await res.json();

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  } satisfies AxiosResponse;
};
