'use server'

import { updateUserProfile } from "@/features/setting/model/updateUserProfile"
import { UserProfileFormData } from '@/features/setting/types/profile.types'
import { revalidatePath } from 'next/cache'
import { fail, Result, success } from "@/shared/utils/result"

export async function updateUserProfileAction(form: FormData): Promise<Result<null>> {
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

    await updateUserProfile(data)
    revalidatePath('/dashboard/settings')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
