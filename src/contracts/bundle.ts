import { z } from 'zod';

const bundleScope = ['current', 'thread'];
export const QueryScopeSchema = z.enum(bundleScope);
export type QueryScope = z.infer<typeof QueryScopeSchema>;

export type BundleScope = (typeof bundleScope)[number];

export const RecommendedFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  isNew: z.boolean(),
});
export type RecommendedFile = z.infer<typeof RecommendedFileSchema>;

export const FrontRequestSchema = z
  .object({
    completed: z.boolean(),
    summary: z.string(),
    reasoning: z.string(),
    files: z.array(RecommendedFileSchema),
    clarification: z.string().optional(),
  })
  .refine((v) => !(v.clarification && v.files.length > 0), {
    message: 'Cannot have both clarification and files',
  });

export type FrontRequest = z.infer<typeof FrontRequestSchema>;
