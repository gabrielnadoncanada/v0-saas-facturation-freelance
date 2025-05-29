'use server'

import { deleteLogo } from "@/features/setting/model/deleteLogo"
import { Result } from "@/shared/utils/result"
import { withAction } from "@/shared/utils/withAction"
import { revalidatePath } from 'next/cache'
import { PROFILE_PATH } from "@/shared/lib/routes"

export async function deleteLogoAction(): Promise<Result<null>> {
  return withAction(async () => {
    await deleteLogo()
    revalidatePath(PROFILE_PATH)
    return null
  })
}
