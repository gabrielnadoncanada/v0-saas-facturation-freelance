import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/features/client/shared/types/client.types';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getClients(): Promise<Client[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Client>(
    supabase, 
    'clients', 
    '*', 
    { user_id: user.id }, 
    { column: 'name', ascending: true }
  )
} 