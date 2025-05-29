import { getSessionUser } from '@/shared/utils/getSessionUser'
import { UserProfile } from '@/features/setting/types/profile.types'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getUserProfile(): Promise<UserProfile> {
  const { supabase, user } = await getSessionUser()

  return await fetchById<UserProfile>(
    supabase,
    'profiles',
    user.id,
    '*'
  )
}
