import { ZodSchema } from 'zod';
import type { FormResult } from '@/shared/types/api.types';

export async function safeParseForm<T>(
  formData: FormData,
  schema: ZodSchema<T>,
): Promise<FormResult<T>> {
  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation échouée',
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<keyof T, string[]>>,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
