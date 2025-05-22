'use server'

import { uploadLogo } from "@/features/setting/model/uploadLogo"
import { fail, Result, success } from "@/shared/utils/result"
import { revalidatePath } from 'next/cache'

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  try {
    const logoFile = formData.get("logo") as File
    const publicUrl = await uploadLogo(logoFile)
    revalidatePath("/dashboard/profile")
    return success(publicUrl)
  } catch (error) {
    return fail((error as Error).message)
  }
}
