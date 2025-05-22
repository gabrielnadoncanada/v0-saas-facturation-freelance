'use server'

import { deleteLogo } from "@/features/setting/model/deleteLogo"
import { fail, Result, success } from "@/shared/utils/result"
import { revalidatePath } from 'next/cache'

export async function deleteLogoAction(): Promise<Result<null>> {
  try {
    await deleteLogo()
    revalidatePath('/dashboard/profile')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
