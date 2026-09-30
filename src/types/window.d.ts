// src/types/window.d.ts
import type { AppConfig } from '>/contracts';

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

export {};
