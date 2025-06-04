import { Client } from '@/features/client/shared/types/client.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchById } from '@/shared/services/supabase/crud';

export async function getClientDetail(clientId: string): Promise<Client> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await fetchById<Client>(supabase, 'clients', clientId, '*', {
    organization_id: organization.id,
  });
}
