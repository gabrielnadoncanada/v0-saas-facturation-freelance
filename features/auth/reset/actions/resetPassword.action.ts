'use server';

import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '@/features/auth/shared/schema/auth.schema';
import { createClient } from '@/shared/lib/supabase/server';
import type { FormResult } from '@/shared/types/api.types';
import { safeParseForm } from '@/shared/utils/safeParseForm';

export async function resetPasswordAction(
  formData: FormData,
): Promise<FormResult<ResetPasswordSchema>> {
  const parsed = await safeParseForm(formData, resetPasswordSchema);
  if (!parsed.success) return parsed;

  const { password } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { success: false, error: error.message };

  return { success: true, data: parsed.data };
}
