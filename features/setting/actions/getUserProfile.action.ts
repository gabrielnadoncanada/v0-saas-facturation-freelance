'use server'

import { getUserProfile } from '@/features/setting/model/getUserProfile'
import { UserProfile } from '@/features/setting/types/profile.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function getUserProfileAction(): Promise<Result<UserProfile>> {
  return withAction(async () => {
    const profile = await getUserProfile()
    return profile
  })
}
