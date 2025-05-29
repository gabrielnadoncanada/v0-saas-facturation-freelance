'use server'

import { uploadLogo } from "@/features/setting/model/uploadLogo"
import { fail, Result, success } from "@/shared/utils/result"
import { revalidatePath } from 'next/cache'
import { PROFILE_PATH } from '@/shared/lib/routes'

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  try {
    const logoFile = formData.get("logo") as File
    const publicUrl = await uploadLogo(logoFile)
    revalidatePath(PROFILE_PATH)
    return success(publicUrl)
  } catch (error) {
    return fail((error as Error).message)
  }
}
