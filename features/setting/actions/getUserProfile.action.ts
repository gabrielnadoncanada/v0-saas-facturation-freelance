'use server'

import { fetchUserProfile } from '../model/fetchUserProfile'
import { UserProfileActionResult } from '@/shared/types/settings/profile'

export async function getUserProfileAction(): Promise<UserProfileActionResult> {
  try {
    const profile = await fetchUserProfile()
    return { success: true, data: profile }
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
}
