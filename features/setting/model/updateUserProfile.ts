import { getSessionUser } from '@/shared/utils/getSessionUser'
import { UserProfileFormData } from '@/features/setting/types/profile.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateUserProfile(formData: UserProfileFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const {
    name,
    email,
    company_name,
    address,
    phone,
    default_currency,
    tax_rate,
    tax_id,
    website,
  } = formData

  await updateRecord(
    supabase,
    'profiles',
    user.id,
    {
      name,
      company_name,
      address,
      phone,
      default_currency,
      tax_rate,
      tax_id,
      website,
    }
  )

  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email })
    if (emailError) throw new Error(emailError.message)
  }
}
