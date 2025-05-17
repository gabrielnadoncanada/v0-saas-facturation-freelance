import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deletePaymentInDb(paymentId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que le paiement appartient bien à l'utilisateur
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*, invoices(id, total, user_id)")
    .eq("id", paymentId)
    .single()

  if (paymentError || !payment || payment.invoices.user_id !== user.id) {
    throw new Error("Paiement non trouvé ou non autorisé")
  }

  // Supprimer le paiement
  const { error: deleteError } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  // Recalculer les paiements restants de la facture
  const { data: remainingPayments, error: remainingError } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", payment.invoice_id)

  if (remainingError) {
    throw new Error(remainingError.message)
  }

  const totalPaid = remainingPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

  // Mettre à jour le statut si nécessaire
  if (totalPaid < payment.invoices.total) {
    await supabase
      .from("invoices")
      .update({ status: "sent" })
      .eq("id", payment.invoice_id)
  }
}
