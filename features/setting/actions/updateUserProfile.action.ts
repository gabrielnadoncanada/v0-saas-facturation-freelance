'use server'

import { updateUserProfileInDb } from "@/features/setting/model/updateUserProfileInDb"
import { UserProfileActionResult, UserProfileFormData } from '@/shared/types/settings/profile'
import { revalidatePath } from 'next/cache'

export async function updateUserProfileAction(form: FormData): Promise<UserProfileActionResult> {
  try {
    const data: UserProfileFormData = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      company_name: form.get('company_name') as string,
      address: form.get('address') as string,
      phone: form.get('phone') as string,
      default_currency: form.get('default_currency') as string,
      tax_rate: Number.parseFloat(form.get('tax_rate') as string) || 0,
      tax_id: form.get('tax_id') as string,
      website: form.get('website') as string,
    }

    await updateUserProfileInDb(data)
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
