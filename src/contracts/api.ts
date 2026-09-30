import { z } from 'zod';

export const AiStatusSchema = z.object({
  active: z.boolean(),
  model: z.string(),
});

export const BasicResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  aiStatus: AiStatusSchema,
});
export type BasicResponse = z.infer<typeof BasicResponseSchema>;

const ColumnSchema = z.object({
  type: z.string(),
  label: z.string().optional(),
});

export const BasicRowsShapeSchema = z.object({
  rows: z.array(z.unknown()),
  cols: z.record(z.string(), ColumnSchema),
  columnsOrder: z.array(z.string()),
});
export type BasicRowsShape = z.infer<typeof BasicRowsShapeSchema>;

export const TableDataSchema = z.object({
  columnsOrder: z.array(z.string()),
  rows: z.array(z.array(z.json())),
});
export type TableData = z.infer<typeof TableDataSchema>;

export const DelayedRequestSchema = z.object({
  delay: z.number().int().nonnegative(),
});

export const DelayedResponseSchema = z.object({ ...BasicResponseSchema.shape });

export type DelayedRequest = z.infer<typeof DelayedRequestSchema>;
export type DelayedResponse = z.infer<typeof DelayedResponseSchema>;

export const LoadSettingsResponseSchema = BasicResponseSchema.extend({
  theme: z.string(),
});

export type LoadSettingsResponse = z.infer<typeof LoadSettingsResponseSchema>;

export const SaveSettingsRequestSchema = z.object({
  theme: z.string(),
});
export type SaveSettingsRequest = z.infer<typeof SaveSettingsRequestSchema>;

// Scan Files
// Request is a list of paths the user requested for this prompt
// Response is record of strings with a string array
export const FolderPathSchema = z.object({
  path: z.string(),
  depth: z.number().optional(),
});
export type FolderPath = z.infer<typeof FolderPathSchema>;

export const GetPathsRequestSchema = z.object({
  paths: z.array(FolderPathSchema),
  fileTypes: z.array(z.string()).optional(),
});
export type GetPathsRequest = z.infer<typeof GetPathsRequestSchema>;

export const GetPathsResponseSchema = BasicResponseSchema.extend({
  paths: z.record(z.string(), z.array(z.string())),
});
export type GetPathsResponse = z.infer<typeof GetPathsResponseSchema>;

export const GetPathsContract = {
  requestSchema: GetPathsRequestSchema,
  responseSchema: GetPathsResponseSchema,
};

export const ReadFileRequestSchema = z.object({
  path: z.string(),
  name: z.string(),
});
export type ReadFileRequest = z.infer<typeof ReadFileRequestSchema>;

export const ReadFileResponseSchema = BasicResponseSchema.extend({
  code: z.string(),
});
export type ReadFileResponse = z.infer<typeof ReadFileResponseSchema>;

export const ReadFileContract = {
  requestSchema: ReadFileRequestSchema,
  responseSchema: ReadFileResponseSchema,
};

export const BundleFilesRequestSchema = z.object({
  paths: z.record(z.string(), z.array(z.string())),
});
export type BundleFilesRequest = z.infer<typeof BundleFilesRequestSchema>;

export const BundleFilesResponseSchema = BasicResponseSchema.extend({
  totalTokens: z.number(),
  bundle: z.record(z.string(), z.array(z.string())),
});
export type BundleFilesResponse = z.infer<typeof BundleFilesResponseSchema>;

export const BundleFilesContract = {
  requestSchema: BundleFilesRequestSchema,
  responseSchema: BundleFilesResponseSchema,
};

export const GetTableDataRequestSchema = z.object({
  table: z.string(),
});
export type GetTableDataRequest = z.infer<typeof GetTableDataRequestSchema>;

export const GetTableDataResponseSchema = z.object({
  ...BasicResponseSchema.shape,
  ...TableDataSchema.shape,
});
export type GetTableDataResponse = z.infer<typeof GetTableDataResponseSchema>;

export const GetTableDataSchema = {
  requestSchema: GetTableDataRequestSchema,
  responseSchema: GetTableDataResponseSchema,
};
