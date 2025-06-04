import { getSessionUser } from '@/shared/utils/getSessionUser';
import { count } from '@/shared/services/supabase/crud';

export async function countClients(): Promise<number> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    return 0;
  }

  return count(supabase, 'clients', { organization_id: organization.id });
}
