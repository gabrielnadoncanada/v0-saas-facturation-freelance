import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getPaymentInvoices(paymentInvoiceId: string): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .or(`status.eq.sent,id.eq.${paymentInvoiceId}`)
    .order("due_date", { ascending: false })

  return extractDataOrThrow<Invoice[]>(res)
}
