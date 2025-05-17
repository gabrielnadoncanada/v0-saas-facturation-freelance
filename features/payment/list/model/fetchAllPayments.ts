import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Payment } from '@/shared/types/payments/payment'

export async function fetchAllPayments(): Promise<Payment[]> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("payments")
    .select("*, invoices(invoice_number, client_id, clients(name))")
    .eq("invoices.user_id", user.id)
    .order("payment_date", { ascending: false })

  if (error) throw new Error("Erreur lors de la récupération des paiements")

  return (data || []).map((payment) => ({
    ...payment,
    invoice_number: payment.invoices?.invoice_number,
    client_name: payment.invoices?.clients?.name,
  }))
}
