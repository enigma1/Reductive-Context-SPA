/* src/config/contracts/api.ts
  Infers API types with back end
  Validates APIs requests/responses with the back end
*/
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

// Scan Folder/Files
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

const codeMode = ['code', 'signature'] as const;
export type FileMode = (typeof codeMode)[number];

const CodeRangeSchema = z.object({
  startLine: z.number().int().min(1),
  endLine: z.number().int().min(1),
});
export type CodeRange = z.infer<typeof CodeRangeSchema>;

export const FileNodeSchema = z.object({
  path: z.string(),
  name: z.string(),
  mode: z.enum(codeMode).optional(),
  ranges: z.array(CodeRangeSchema).optional(),
});
export type FileNode = z.infer<typeof FileNodeSchema>;

export const CreateBundleRequestSchema = z.object({
  paths: z.array(FileNodeSchema),
  prompt: z.string().min(10),
});
export type CreateBundleRequest = z.infer<typeof CreateBundleRequestSchema>;

export const CreateBundleResponseSchema = BasicResponseSchema.extend({
  totalTokens: z.number(),
  bundleId: z.number(),
});
export type CreateBundleResponse = z.infer<typeof CreateBundleResponseSchema>;

export const CreateBundleContract = {
  requestSchema: CreateBundleRequestSchema,
  responseSchema: CreateBundleResponseSchema,
};

export const GetBundleRequestSchema = z.object({
  bundleId: z.number(),
});
export type GetBundleRequest = z.infer<typeof GetBundleRequestSchema>;

export const GetBundleResponseSchema = BasicResponseSchema.extend({
  totalTokens: z.number(),
  bundleId: z.number(),
  bundleContent: z.string(),
});
export type GetBundleResponse = z.infer<typeof GetBundleResponseSchema>;

export const GetBundleContract = {
  requestSchema: GetBundleRequestSchema,
  responseSchema: GetBundleResponseSchema,
};

export const SetBundleRequestSchema = z.object({
  bundleId: z.number(),
  bundleContent: z.string(),
});
export type SetBundleRequest = z.infer<typeof SetBundleRequestSchema>;

export const SetBundleResponseSchema = BasicResponseSchema.extend({
  totalTokens: z.number(),
  bundleId: z.number(),
});
export type SetBundleResponse = z.infer<typeof SetBundleResponseSchema>;

export const SetBundleContract = {
  requestSchema: SetBundleRequestSchema,
  responseSchema: SetBundleResponseSchema,
};

export const SubmitBundleRequestSchema = z.object({
  bundleId: z.number(),
  bundleContent: z.string(),
});
export type SubmitBundleRequest = z.infer<typeof SubmitBundleRequestSchema>;

export const SubmitBundleResponseSchema = BasicResponseSchema.extend({
  totalTokens: z.number(),
  bundleId: z.number(),
});
export type SubmitBundleResponse = z.infer<typeof SubmitBundleResponseSchema>;

export const SubmitBundleContract = {
  requestSchema: SubmitBundleRequestSchema,
  responseSchema: SubmitBundleResponseSchema,
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

export const GetTableDataContract = {
  requestSchema: GetTableDataRequestSchema,
  responseSchema: GetTableDataResponseSchema,
};

// const BundleRow = {
//   bundleId: z.number().int().nonnegative(),
//   prompt: z.string(),
//   bundleContent: z.string(),
//   totalTokens: z.number().int(),
//   createdAt: z.iso.datetime(),
//   lastModified: z.iso.datetime(),
// };

// export const BundleRowSchema = z.object(BundleRow);
// export type BundleRowShape = z.infer<typeof BundleRowSchema>;

export const GetBundleListRequestSchema = z.void();
export type GetBundleListRequest = z.infer<typeof GetBundleListRequestSchema>;
export const GetBundleListResponseSchema = BasicResponseSchema.extend({
  ...BasicRowsShapeSchema.shape,
});

// export const GetBundleListResponseSchema = BasicResponseSchema.extend({
//   columnsOrder: z.array(BundleRowSchema.keyof()),
//   rows: z.array(z.array(BundleRowSchema)),
// });
export type GetBundleListResponse = z.infer<typeof GetBundleListResponseSchema>;

export const GetBundleListContract = {
  requestSchema: GetBundleListRequestSchema,
  responseSchema: GetBundleListResponseSchema,
};
