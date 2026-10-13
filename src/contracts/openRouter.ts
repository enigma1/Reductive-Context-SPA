import { z } from 'zod';

export const OpenRouterModelSchema = z.object({
  id: z.string(),
  canonical_slug: z.string().optional(),

  alias_target: z
    .object({
      name: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),

  hugging_face_id: z.string().nullable().optional(),
  name: z.string(),
  created: z.number().optional(),
  description: z.string().optional(),
  context_length: z.number().optional(),

  architecture: z
    .object({
      modality: z.string().optional(),
      input_modalities: z.array(z.string()).optional(),
      output_modalities: z.array(z.string()).optional(),
      tokenizer: z.string().optional(),
    })
    .optional(),

  pricing: z
    .record(z.string(), z.union([z.string(), z.array(z.string()), z.unknown()]))
    .optional(),

  top_provider: z
    .object({
      context_length: z.number().optional(),
      max_completion_tokens: z.number().optional(),
      is_moderated: z.boolean().optional(),
    })
    .optional(),

  per_request_limits: z.record(z.string(), z.unknown()).nullable().optional(),
  supported_parameters: z.array(z.string()).optional(),
  default_parameters: z.record(z.string(), z.unknown()).optional(),
  supported_voices: z.array(z.string()).nullable().optional(),
  knowledge_cutoff: z.string().nullable().optional(),
  expiration_date: z.string().nullable().optional(),
  links: z.record(z.string(), z.string()).optional(),

  reasoning: z
    .object({
      mandatory: z.boolean().optional(),
      default_enabled: z.boolean().optional(),
      supported_efforts: z.array(z.string()).optional(),
      default_effort: z.string().optional(),
    })
    .optional(),
});

export type OpenRouterModel = z.infer<typeof OpenRouterModelSchema>;
