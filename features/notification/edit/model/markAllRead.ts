import { getSessionUser } from '@/shared/utils/getSessionUser'
import { batchUpdate } from '@/shared/services/supabase/crud'
import { DbNotification } from '@/features/notification/shared/types/notification.types'

export async function markAllNotificationsRead(): Promise<void> {
  const { supabase, user } = await getSessionUser()

  await batchUpdate<DbNotification>(
    supabase,
    'notifications',
    { read: true, updated_at: new Date().toISOString() },
    { user_id: user.id, read: false }
  )
}
