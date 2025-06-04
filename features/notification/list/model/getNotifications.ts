import { getSessionUser } from '@/shared/utils/getSessionUser'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getNotifications(): Promise<DbNotification[]> {
  const { supabase, user, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  // For notifications, we still need to filter by user_id since notifications are personal
  // But we also add organization context to ensure we only see notifications for the current organization
  return await fetchList<DbNotification>(
    supabase,
    'notifications',
    '*',
    { 
      user_id: user.id,
      organization_id: organization.id 
    },
    { column: 'created_at', ascending: false }
  )
}
