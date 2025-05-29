'use server'

import { signUpWithEmail } from '@/shared/services/auth'
import { RegisterSchema, registerSchema } from '@/features/auth/shared/schema/auth.schema'
import { revalidatePath } from 'next/cache'
import { safeParseForm } from '@/shared/utils/safeParseForm'
import type { FormResult } from '@/shared/types/api.types'
import { DASHBOARD_PATH } from '@/shared/lib/routes'

export async function registerUserAction(formData: FormData): Promise<FormResult<RegisterSchema>> {
  const parsed = await safeParseForm(formData, registerSchema)
  if (!parsed.success) return parsed


  const { email, password, full_name } = parsed.data

  const { error } = await signUpWithEmail(email, password, full_name)
  if (error) return { success: false, error }

  revalidatePath(DASHBOARD_PATH)
  return { success: true, data: parsed.data }
}
