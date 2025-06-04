import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/features/client/shared/types/client.types';
import { deleteRecord } from '@/shared/services/supabase/crud';

export async function deleteClient(clientId: string): Promise<Client> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await deleteRecord<Client>(supabase, 'clients', clientId, '*', {
    organization_id: organization.id,
  });
}
