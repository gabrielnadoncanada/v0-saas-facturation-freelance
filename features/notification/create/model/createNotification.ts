import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { DbNotification, NotificationFormData } from '@/features/notification/shared/types/notification.types'

export async function createNotification(data: NotificationFormData): Promise<DbNotification> {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    user_id: user.id,
    read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const res = await supabase.from('notifications').insert(finalData).select('*').single()

  return extractDataOrThrow<DbNotification>(res)
}
