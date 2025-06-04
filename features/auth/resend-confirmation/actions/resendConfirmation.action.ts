'use server';

import {
  ResendConfirmationSchema,
  resendConfirmationSchema,
} from '@/features/auth/shared/schema/auth.schema';
import { createClient } from '@/shared/lib/supabase/server';
import type { FormResult } from '@/shared/types/api.types';
import { safeParseForm } from '@/shared/utils/safeParseForm';

export async function resendConfirmationAction(
  formData: FormData,
): Promise<FormResult<ResendConfirmationSchema>> {
  const parsed = await safeParseForm(formData, resendConfirmationSchema);
  if (!parsed.success) return parsed;

  const { email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) return { success: false, error: error.message };

  return { success: true, data: parsed.data };
}
