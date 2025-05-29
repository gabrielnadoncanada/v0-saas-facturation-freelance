'use server'

import { uploadLogo } from "@/features/setting/model/uploadLogo"
import { Result } from "@/shared/utils/result"
import { withAction } from "@/shared/utils/withAction"
import { revalidatePath } from 'next/cache'

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  return withAction(async () => {
    const logoFile = formData.get("logo") as File
    const publicUrl = await uploadLogo(logoFile)
    return publicUrl
  }, { revalidatePath: '/dashboard/profile' })
}
