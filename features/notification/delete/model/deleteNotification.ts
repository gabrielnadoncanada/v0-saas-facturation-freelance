import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { DbNotification } from '@/features/notification/shared/types/notification.types'

export async function deleteNotification(id: string): Promise<DbNotification> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  return extractDataOrThrow<DbNotification>(res)
}
