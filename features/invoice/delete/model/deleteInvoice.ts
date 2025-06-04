import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { deleteRecord } from '@/shared/services/supabase/crud';

export async function deleteInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await deleteRecord<Invoice>(supabase, 'invoices', invoiceId, '*', {
    organization_id: organization.id,
  });
}
