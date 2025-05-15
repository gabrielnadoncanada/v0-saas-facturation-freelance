import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchPaymentInvoices(paymentInvoiceId: string) {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_id, total, clients(name)")
    .eq("user_id", user.id)
    .or(`status.eq.sent,id.eq.${paymentInvoiceId}`)
    .order("due_date", { ascending: false })

  if (error) throw new Error("Erreur lors de la récupération des factures")
  return data || []
}
