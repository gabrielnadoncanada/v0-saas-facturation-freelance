'use server'

import { updateUserProfile } from "@/features/setting/model/updateUserProfile"
import { UserProfileFormData } from '@/features/setting/types/profile.types'
import { profileFormSchema } from '@/features/setting/schema/profile.schema'
import { revalidatePath } from 'next/cache'
import { Result, fail } from "@/shared/utils/result"
import { withAction } from "@/shared/utils/withAction"
import { safeParseForm } from '@/shared/utils/safeParseForm'

export async function updateUserProfileAction(form: FormData): Promise<Result<null>> {
  const parsed = await safeParseForm(form, profileFormSchema)
  if (!parsed.success) {
    const errorMessage =
      Object.values(parsed.fieldErrors ?? {}).join(', ') || parsed.error
    return fail(errorMessage)
  }

  return withAction(async () => {
    await updateUserProfile(parsed.data as UserProfileFormData)
    return null
  }, { revalidatePath: '/dashboard/profile' })
}
