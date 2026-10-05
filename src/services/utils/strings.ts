/* File src/services/strings.ts
  String common support functions
*/
import { MAX_TEXT_STRING } from '>/config';

export const isEmptyString = (s: unknown): s is string =>
  typeof s === 'string' && s.length === 0;
export const isAlphanumeric = (key: string) => /^[a-z0-9]+$/i.test(key);
export const kebabCase = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const trimString = (query: string) => query.replace(/\s+/g, ' ').trim();

export const truncateString = (value: string, max = MAX_TEXT_STRING) =>
  value.length > max ? value.slice(0, max) + '...' : value;

export const isNonEmptyString = (s: unknown): s is string =>
  typeof s === 'string' && s.trim().length > 0;

type HasitProps = {
  input: string;
  parts: readonly string[];
  at?: number;
};

export const hasit = ({ input, parts, at = 0 }: HasitProps) => {
  const value = input.toLowerCase();

  return parts.some((part) => {
    const prefix = part.toLowerCase();
    return value.startsWith(prefix, at);
  });
};

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(1)} ${units[unit]}`;
};
