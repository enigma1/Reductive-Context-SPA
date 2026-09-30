import type { AppConfig } from '>/contracts';
export const getAppConfig = (): AppConfig => window.APP_CONFIG;
export const backPath = `${window.location.protocol}//${window.location.hostname}`;
