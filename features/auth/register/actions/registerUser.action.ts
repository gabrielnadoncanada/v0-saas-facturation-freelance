'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { RegisterSchema, registerSchema } from '@/features/auth/shared/schema/auth.schema'
import { revalidatePath } from 'next/cache'
import { safeParseForm } from '@/shared/utils/safeParseForm'
import type { FormResult } from '@/shared/types/api.types'
import { env } from '@/shared/lib/env'

export async function registerUserAction(formData: FormData): Promise<FormResult<RegisterSchema>> {
  const parsed = await safeParseForm(formData, registerSchema)
  if (!parsed.success) return parsed


  const { email, password, full_name } = parsed.data
  const supabase = createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (authError) return { success: false, error: authError.message }

  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name,
    })
    if (profileError) return { success: false, error: profileError.message }
  }

  revalidatePath('/dashboard')
  return { success: true, data: parsed.data }
}
