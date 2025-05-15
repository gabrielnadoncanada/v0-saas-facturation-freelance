import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchPaymentById(paymentId: string) {
  const { supabase, user } = await getSessionUser()

  const { data: rawPayment, error } = await supabase
    .from("payments")
    .select("*, invoices(id, invoice_number, client_id, total, user_id, clients(name))")
    .eq("id", paymentId)
    .single()

  if (error || !rawPayment || rawPayment.invoices.user_id !== user.id) {
    throw new Error("Paiement non trouvé")
  }

  // Flatten les champs nécessaires pour l'UI
  return {
    ...rawPayment,
    invoice_number: rawPayment.invoices?.invoice_number,
    client_name: rawPayment.invoices?.clients?.name,
  }
}
