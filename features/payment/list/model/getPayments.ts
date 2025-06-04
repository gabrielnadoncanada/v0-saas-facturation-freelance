import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Payment } from '@/features/payment/shared/types/payment.types';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getPayments(): Promise<Payment[]> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    return [];
  }

  return await fetchList<Payment>(
    supabase,
    'payments',
    '*, invoice:invoices(invoice_number, client_id, client:clients(name))',
    { 'invoices.organization_id': organization.id },
    { column: 'payment_date', ascending: false },
  );
}
