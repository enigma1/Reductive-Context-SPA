import { useCallback, useState } from 'react';
import { keys } from 'object-hash';
import { formsStoreActions } from '>/services/stores';
import isEqual from 'lodash-es/isEqual';

type SimpleFormOptions = {
  autoTouch?: boolean;
  presetFields?: string[];
};

export const useSimpleForm = <T extends Record<string, unknown>>(
  initialValues: T,
  options: SimpleFormOptions = {},
) => {
  const { autoTouch = false } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [profileId] = useState(() => {
    const { presetFields } = options;
    if (!presetFields) return keys(initialValues);
    const specificValues = presetFields.reduce((acc, item) => {
      return {
        ...acc,
        [item]: initialValues[item],
      };
    }, {});
    return keys(specificValues);
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const saveProfile = useCallback(
    (customProfileId?: string) => {
      const resolvedProfileId =
        customProfileId ??
        (Array.isArray(profileId) ? profileId.join('-') : profileId);
      formsStoreActions.addProfileEntry(resolvedProfileId, values);
    },
    [profileId, values],
  );

  const markTouched = useCallback(
    <K extends keyof T>(key: K, value: T[K] = values[key]) => {
      setTouched((current) => {
        const next = new Set(current);

        if (Object.is(value, initialValues[key])) {
          next.delete(String(key));
        } else {
          next.add(String(key));
        }

        return next;
      });
    },
    [initialValues, values],
  );

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((current) => ({
        ...current,
        [key]: value,
      }));
      setSubmitAttempted(false);

      if (autoTouch) {
        setTouched((current) => {
          const next = new Set(current);

          if (isEqual(value, initialValues[key])) {
            next.delete(String(key));
          } else {
            next.add(String(key));
          }

          return next;
        });
      }
    },
    [autoTouch, initialValues],
  );

  const isFieldTouched = useCallback(
    (key: keyof T) => touched.has(String(key)),
    [touched],
  );

  const resetFields = useCallback(
    (keys: readonly (keyof T)[]) => {
      setValues((current) => {
        const next = { ...current };

        for (const key of keys) {
          next[key] = initialValues[key];
        }

        return next;
      });

      setTouched((current) => {
        const next = new Set(current);

        for (const key of keys) {
          next.delete(String(key));
        }

        return next;
      });
    },
    [initialValues],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched(new Set());
    setSubmitAttempted(false);
  }, [initialValues]);

  return {
    values,
    setValue,
    setValues,
    reset,
    resetFields,
    markTouched,
    isFieldTouched,
    submitAttempted,
    setSubmitAttempted,
    saveProfile,
    profileId,
  };
};
