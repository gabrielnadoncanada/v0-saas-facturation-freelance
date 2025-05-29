import { getSessionUser } from '@/shared/utils/getSessionUser'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getNotifications(): Promise<DbNotification[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<DbNotification>(
    supabase,
    'notifications',
    '*',
    { user_id: user.id },
    { column: 'created_at', ascending: false }
  )
}
