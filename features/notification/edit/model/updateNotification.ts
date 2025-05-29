import { getSessionUser } from '@/shared/utils/getSessionUser'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateNotification(
  id: string,
  data: Partial<DbNotification>,
): Promise<DbNotification> {
  const { supabase, user } = await getSessionUser()

  const updateData = { 
    ...data, 
    updated_at: new Date().toISOString() 
  }

  return await updateRecord<DbNotification>(
    supabase,
    'notifications',
    id,
    updateData,
    '*',
    { user_id: user.id }
  )
}
