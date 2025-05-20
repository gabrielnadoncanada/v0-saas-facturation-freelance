'use server'

import { ForgotPasswordSchema, forgotPasswordSchema } from '@/features/auth/shared/schema/auth.schema'
import { createClient } from '@/shared/lib/supabase/server'
import type { FormResult } from '@/shared/types/api.types'
import { safeParseForm } from '@/shared/utils/safeParseForm'

export async function forgotPasswordAction(formData: FormData): Promise<FormResult<ForgotPasswordSchema>> {
  const parsed = await safeParseForm(formData, forgotPasswordSchema)
  if (!parsed.success) return parsed

  const { email } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) return { success: false, error: error.message }

  return { success: true, data: parsed.data }
}
