export const aStub: readonly unknown[] = [];
export const oStub: Readonly<Record<string, unknown>> = {};
export const fStub = (): void => {};

export const NOT_SET = 'n/a';
export const MAX_TEXT_STRING = 1000;
export const STALE_TIME = 3 * 60 * 1000; // Set default to 3 minutes
export const KEEP_IN_CACHE_TIME = 8 * 60 * 1000; // Set default to 10 minutes
