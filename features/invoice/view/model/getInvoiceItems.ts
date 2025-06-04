import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  const { supabase } = await getSessionUser();

  return await fetchList<InvoiceItem>(
    supabase,
    'invoice_items',
    '*',
    { invoice_id: invoiceId },
    { column: 'position', ascending: true },
  );
}
