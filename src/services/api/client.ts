import axios from 'axios';
import { z } from 'zod';
import { mockAdapter } from './mockAdapter';

declare module 'axios' {
  interface AxiosRequestConfig {
    requestSchema?: z.ZodType;
    responseSchema?: z.ZodType;
  }
}

export const apiClient = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (config.requestSchema) {
    const result = config.requestSchema.safeParse(config.data);
    if (!result.success) {
      return Promise.reject(result.error);
    }

    config.data = result.data;
  }

  config.headers['reductive-context-version'] =
    window.APP_CONFIG.appInfo.appVersion;

  if (import.meta.env.VITE_MOCK_MODE === 'true') {
    config.adapter = mockAdapter;
  }

  return config;
});

apiClient.interceptors.response.use((response) => {
  if (response.config.responseSchema) {
    const result = response.config.responseSchema.safeParse(response.data);
    console.log('axios-response', result);
    if (!result.success) {
      return Promise.reject(result.error);
    }

    response.data = result.data;
  }

  return response;
});

export const configureApiClient = (baseURL: string) => {
  apiClient.defaults.baseURL = baseURL;
};
