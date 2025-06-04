import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/features/client/shared/types/client.types';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getClients(): Promise<Client[]> {
  const { supabase, user, organization } = await getSessionUser();

  if (!organization) {
    return [];
  }

  return await fetchList<Client>(
    supabase,
    'clients',
    '*',
    { organization_id: organization.id },
    { column: 'name', ascending: true },
  );
}
