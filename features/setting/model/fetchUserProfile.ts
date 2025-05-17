import { getSessionUser } from '@/shared/utils/getSessionUser'
import { UserProfile } from '@/shared/types/settings/profile'

export async function fetchUserProfile(): Promise<UserProfile> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as UserProfile
}
