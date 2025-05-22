import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { DbNotification } from '@/features/notification/shared/types/notification.types'

export async function updateNotification(
  id: string,
  data: Partial<DbNotification>,
): Promise<DbNotification> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('notifications')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  return extractDataOrThrow<DbNotification>(res)
}
