import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Payment } from '@/features/payment/shared/types/payment.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getPayments(): Promise<Payment[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Payment>(
    supabase,
    'payments',
    '*, invoice:invoices(invoice_number, client_id, client:clients(name))',
    { 'invoices.user_id': user.id },
    { column: 'payment_date', ascending: false }
  )
}
