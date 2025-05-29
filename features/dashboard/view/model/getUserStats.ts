import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getUserStats() {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase.rpc("get_user_stats", {
    user_id_param: user.id,
  })

  if (error) throw new Error(error.message)
  return data?.[0] || null
}
