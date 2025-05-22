'use server'

import { updateUserProfile } from "@/features/setting/model/updateUserProfile"
import { UserProfileFormData } from '@/features/setting/types/profile.types'
import { profileFormSchema } from '@/features/setting/schema/profile.schema'
import { revalidatePath } from 'next/cache'
import { fail, Result, success } from "@/shared/utils/result"
import { safeParseForm } from '@/shared/utils/safeParseForm'

export async function updateUserProfileAction(form: FormData): Promise<Result<null>> {
  const parsed = await safeParseForm(form, profileFormSchema)
  if (!parsed.success) {
    const errorMessage =
      Object.values(parsed.fieldErrors ?? {}).join(', ') || parsed.error
    return fail(errorMessage)
  }

  try {
    await updateUserProfile(parsed.data as UserProfileFormData)
    revalidatePath('/dashboard/profile')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
