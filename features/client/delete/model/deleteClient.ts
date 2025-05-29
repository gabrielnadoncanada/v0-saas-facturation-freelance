import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/features/client/shared/types/client.types';
import { deleteRecord } from '@/shared/services/supabase/crud';

export async function deleteClient(clientId: string): Promise<Client> {
  const { supabase, user } = await getSessionUser()

  return await deleteRecord<Client>(
    supabase,
    'clients',
    clientId,
    '*',
    { user_id: user.id }
  )
} 