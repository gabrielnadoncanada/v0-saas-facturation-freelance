import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Payment } from '@/features/payment/shared/types/payment.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getPayments(): Promise<Payment[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("payments")
    .select("*, invoice:invoices(invoice_number, client_id, client:clients(name))")
    .eq("invoices.user_id", user.id)
    .order("payment_date", { ascending: false })

  return extractDataOrThrow<Payment[]>(res)
}
