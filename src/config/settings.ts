/* File: src/config/settings.ts
  Application settings support functions and constants
*/
import { AppConfigSchema } from '>/contracts';

const validated = AppConfigSchema.parse(window.APP_CONFIG);
export const userPrefs = Object.freeze(validated.userPrefs);
export const appInfo = Object.freeze(validated.appInfo);
export const backPath = `${window.location.protocol}//${window.location.hostname}`;
