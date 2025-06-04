import { Client } from '@/features/client/shared/types/client.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchOne } from '@/shared/services/supabase/crud';

export async function getClient(clientId: string): Promise<Client> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  const client = await fetchOne<Client>(supabase, 'clients', clientId, '*', {
    organization_id: organization.id,
  });

  if (!client) {
    throw new Error('Client non trouvé');
  }

  return client;
}
