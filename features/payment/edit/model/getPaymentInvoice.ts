import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getPaymentInvoices(paymentInvoiceId: string): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser();

  // We can't use the standard fetchList here because of the OR condition
  // so we'll use the raw Supabase query
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .or(`status.eq.sent,id.eq.${paymentInvoiceId}`)
    .order('due_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Invoice[];
}
