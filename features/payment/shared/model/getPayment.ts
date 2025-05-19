import { Payment } from '@/features/payment/shared/types/payment.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getPayment(paymentId: string): Promise<Payment> {
  const { supabase } = await getSessionUser()

  const res = await supabase
    .from("payments")
    .select("*, invoice:invoices(id, invoice_number, client_id, total, user_id, client:clients(name), currency)")
    .eq("id", paymentId)
    .single()

  return extractDataOrThrow<Payment>(res)
}
