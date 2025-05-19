import { getSessionUser } from '@/shared/utils/getSessionUser'
import { UserProfile } from '@/features/setting/types/profile.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getUserProfile(): Promise<UserProfile> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return extractDataOrThrow<UserProfile>(res)
}
