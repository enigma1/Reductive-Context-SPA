import type { BasicResponse } from '>/contracts';

export type ApiOptions = {
  timeout?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};
export type ApiFunction<TData = void, TResponse = any> = (
  data?: TData,
  options?: ApiOptions,
) => Promise<TResponse>;

export type AbortResponse = BasicResponse;

export type DelayedRequest = {
  delay: number;
};
export type DelayedResponse = BasicResponse;

export type LoadSettingsRequest = {};
export type LoadSettingsResponse = BasicResponse & {
  theme: string;
};

export type SaveSettingsRequest = {
  theme: string;
};
export type SaveSettingsResponse = BasicResponse;
