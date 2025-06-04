import { getSessionUser } from '@/shared/utils/getSessionUser';
import {
  DbNotification,
  NotificationFormData,
} from '@/features/notification/shared/types/notification.types';
import { insertRecord } from '@/shared/services/supabase/crud';

export async function createNotification(data: NotificationFormData): Promise<DbNotification> {
  const { supabase, user, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  const finalData = {
    ...data,
    user_id: user.id,
    organization_id: organization.id,
    read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await insertRecord<DbNotification>(supabase, 'notifications', finalData);
}
