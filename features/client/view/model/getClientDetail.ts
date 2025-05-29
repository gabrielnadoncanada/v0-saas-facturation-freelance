import { Client } from '@/features/client/shared/types/client.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchById } from '@/shared/services/supabase/crud';

export async function getClientDetail(clientId: string): Promise<Client> {
  const { supabase, user } = await getSessionUser();

  return await fetchById<Client>(
    supabase,
    'clients',
    clientId,
    '*',
    { user_id: user.id }
  );
} 