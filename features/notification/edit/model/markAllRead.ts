import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function markAllNotificationsRead(): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) throw new Error(error.message)
}
