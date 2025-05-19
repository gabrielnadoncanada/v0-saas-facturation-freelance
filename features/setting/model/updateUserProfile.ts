import { getSessionUser } from '@/shared/utils/getSessionUser'
import { UserProfileFormData } from '@/features/setting/types/profile.types'

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

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      name,
      company_name,
      address,
      phone,
      default_currency,
      tax_rate,
      tax_id,
      website,
    })
    .eq("id", user.id)

  if (updateError) throw new Error(updateError.message)

  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email })
    if (emailError) throw new Error(emailError.message)
  }
}
