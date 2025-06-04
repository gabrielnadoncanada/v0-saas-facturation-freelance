import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getClientInvoices(clientId: string): Promise<Invoice[]> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    return [];
  }

  return await fetchList<Invoice>(
    supabase,
    'invoices',
    '*, client:client_id(*), payments(*)',
    {
      organization_id: organization.id,
      client_id: clientId,
    },
    { column: 'issue_date', ascending: false },
  );
}
