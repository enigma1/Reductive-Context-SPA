import { merge, cloneDeep } from 'lodash-es';
// export const defaultFilterColumnRequest: FilterColumnsRequest = {};

export const hasObjectProps = <K extends string>(
  obj: unknown,
  props: K[],
): obj is Record<K, unknown> => {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  return props.every((key) => key in obj);
};

export const hasStringPropValue = <K extends string, V extends string>(
  obj: unknown,
  key: K,
  value: V,
): obj is Record<K, V> => {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  return (obj as Record<K, unknown>)[key] === value;
};

export const deepCopyStructure = <T extends Record<string, unknown>>(
  original: T,
  extra?: Partial<T>,
): T => {
  if (!extra) return cloneDeep(original);
  return merge(cloneDeep(original), extra);
};
