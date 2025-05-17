'use server'

import { LoginSchema, loginSchema } from '@/features/auth/shared/auth.schema'
import { createClient } from '@/shared/lib/supabase/server'
import { FormResult } from '@/shared/types/api.types'
import { safeParseForm } from '@/shared/utils/safeParseForm'

export async function loginUserAction(formData: FormData): Promise<FormResult<LoginSchema>> {
  const parsed = await safeParseForm(formData, loginSchema)
  if (!parsed.success) return parsed

  const { email, password } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: parsed.data }
}
