import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { DbNotification } from '@/features/notification/shared/types/notification.types'

export async function getNotifications(): Promise<DbNotification[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return extractDataOrThrow<DbNotification[]>(res)
}
