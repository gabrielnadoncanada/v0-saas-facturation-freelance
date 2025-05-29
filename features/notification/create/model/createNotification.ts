import { getSessionUser } from '@/shared/utils/getSessionUser'
import { DbNotification, NotificationFormData } from '@/features/notification/shared/types/notification.types'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createNotification(data: NotificationFormData): Promise<DbNotification> {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    user_id: user.id,
    read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return await insertRecord<DbNotification>(
    supabase,
    'notifications',
    finalData
  )
}
