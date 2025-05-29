'use server'

import { deleteLogo } from "@/features/setting/model/deleteLogo"
import { Result } from "@/shared/utils/result"
import { withAction } from "@/shared/utils/withAction"
import { revalidatePath } from 'next/cache'

export async function deleteLogoAction(): Promise<Result<null>> {
  return withAction(async () => {
    await deleteLogo()
    return null
  }, { revalidatePath: '/dashboard/profile' })
}
