'use server';

import { LoginSchema, loginSchema } from '@/features/auth/shared/schema/auth.schema';
import { signInWithEmail } from '@/shared/services/auth';
import { FormResult } from '@/shared/types/api.types';
import { safeParseForm } from '@/shared/utils/safeParseForm';

export async function loginUserAction(formData: FormData): Promise<FormResult<LoginSchema>> {
  const parsed = await safeParseForm(formData, loginSchema);
  if (!parsed.success) return parsed;

  const { email, password } = parsed.data;

  const { error } = await signInWithEmail(email, password);
  if (error) {
    return { success: false, error };
  }

  return { success: true, data: parsed.data };
}
