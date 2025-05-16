import { ZodSchema, ZodError } from 'zod'
import type { FormResult } from '@/shared/types/api.types'

export async function safeParseForm<T>(
  formData: FormData,
  schema: ZodSchema<T>
): Promise<FormResult<T>> {
  const raw = Object.fromEntries(formData)
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof T, string>> = {}

    parsed.error.errors.forEach((err) => {
      const key = err.path[0]
      if (typeof key === 'string' && key in raw) {
        fieldErrors[key as keyof T] = err.message
      }
    })

    return {
      success: false,
      error: 'Validation échouée',
      fieldErrors,
    }
  }

  return {
    success: true,
    data: parsed.data,
  }
}
