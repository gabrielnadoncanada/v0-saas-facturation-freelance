import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { getSessionUser } from '@/shared/utils/getSessionUser';

export async function getClientInvoices(clientId: string): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser();

  const res = await supabase
    .from('invoices')
    .select('*, client:client_id(*), payments(*)')
    .eq('user_id', user.id)
    .eq('client_id', clientId)
    .order('issue_date', { ascending: false });

  return extractDataOrThrow<Invoice[]>(res);
} 