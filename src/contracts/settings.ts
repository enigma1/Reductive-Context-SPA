import { z } from 'zod';

const noTrim = (name: string) =>
  z
    .string()
    .refine(
      (v) => v === v.trim(),
      `${name} must not contain leading or trailing whitespace`,
    );

export const LayoutPrefsSchema = z.object({
  showHeader: z.boolean(),
  showFooter: z.boolean(),
  showLeftSide: z.boolean(),
  showRightSide: z.boolean(),
  showHeaderMenu: z.boolean(),
});
export type LayoutPrefs = z.infer<typeof LayoutPrefsSchema>;

export const UserPrefsConfigSchema = z.object({
  backPort: z.number().int().min(1).max(65535),
  frontPort: z.number().int().min(1).max(65535),
  theme: noTrim('theme').min(1).max(256),
  layout: LayoutPrefsSchema,
});
export type UserPrefs = z.infer<typeof UserPrefsConfigSchema>;

const AppInfoConfigSchema = z.object({
  storageVersion: z.number().int().positive(),
  appVersion: z.number().int().positive(),
  buildDate: z.coerce.date(),
});

export const AppConfigSchema = z.object({
  userPrefs: UserPrefsConfigSchema,
  appInfo: AppInfoConfigSchema,
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
