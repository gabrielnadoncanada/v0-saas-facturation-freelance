import { getSessionUser } from '@/shared/utils/getSessionUser';
import { DbNotification } from '@/features/notification/shared/types/notification.types';
import { deleteRecord } from '@/shared/services/supabase/crud';

export async function deleteNotification(id: string): Promise<DbNotification> {
  const { supabase, user, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await deleteRecord<DbNotification>(supabase, 'notifications', id, '*', {
    user_id: user.id,
    organization_id: organization.id,
  });
}
