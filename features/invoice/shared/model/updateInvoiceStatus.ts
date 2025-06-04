import { getSessionUser } from '@/shared/utils/getSessionUser';
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';

export async function updateInvoiceStatus(invoiceId: string, status: string): Promise<Invoice> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  const res = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('organization_id', organization.id)
    .select('*')
    .single();

  return extractDataOrThrow<Invoice>(res);
}
