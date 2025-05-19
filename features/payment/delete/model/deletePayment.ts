import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function deletePayment(paymentId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // 1. Lis le paiement + infos facture
  const res = await supabase
    .from("payments")
    .select("id, amount, invoice_id, invoice:invoices(id, total, user_id, status)")
    .eq("id", paymentId)
    .single()

  const payment = extractDataOrThrow<any>(res)
  const invoice = payment.invoice

  if (!invoice || invoice.user_id !== user.id) {
    throw new Error("Paiement non trouvé ou non autorisé")
  }

  // 2. Supprime le paiement (1 query)
  const { error: deleteError } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
  if (deleteError) throw new Error(deleteError.message)

  // 3. Lis la somme des paiements restants sur la facture (1 seule query SQL)
  const { data: sumData, error: sumError } = await supabase
    .rpc("sum_payments_by_invoice", { invoiceid: invoice.id }) // cf. ci-dessous pour la fonction SQL
  if (sumError) throw new Error(sumError.message)

  const totalPaid = sumData ?? 0 // .rpc() retourne null si aucun paiement, donc 0

  // 4. Mets à jour le statut de la facture si besoin (1 seule query)
  if (totalPaid < Number(invoice.total) && invoice.status !== "sent") {
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: "sent" })
      .eq("id", invoice.id)
    if (updateError) throw new Error(updateError.message)
  }
}
