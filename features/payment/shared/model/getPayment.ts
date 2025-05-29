import { Payment } from '@/features/payment/shared/types/payment.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getPayment(paymentId: string): Promise<Payment> {
  const { supabase } = await getSessionUser()

  return await fetchById<Payment>(
    supabase,
    'payments',
    paymentId,
    '*, invoice:invoices(id, invoice_number, client_id, total, user_id, client:clients(name), currency)'
  )
}
