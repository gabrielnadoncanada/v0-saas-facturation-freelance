'use server'

import { getUserProfile } from '@/features/setting/model/getUserProfile'
import { UserProfile } from '@/features/setting/types/profile.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getUserProfileAction(): Promise<Result<UserProfile>> {
  try {
    const profile = await getUserProfile()
    return success(profile)
  } catch (error) {
    return fail((error as Error).message)
  }
}
