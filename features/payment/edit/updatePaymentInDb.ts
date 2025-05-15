import { getSessionUser } from '@/shared/utils/getSessionUser'
import { PaymentFormData } from '@/shared/types/payments/payment'

export async function updatePaymentInDb(paymentId: string, formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que le paiement existe et appartient à l'utilisateur
  const { data: currentPayment, error: fetchError } = await supabase
    .from("payments")
    .select("*, invoices(id, total, user_id)")
    .eq("id", paymentId)
    .single()

  if (fetchError || !currentPayment || currentPayment.invoices.user_id !== user.id) {
    throw new Error("Paiement non trouvé ou non autorisé")
  }

  // Mettre à jour le paiement
  const { error: updateError } = await supabase
    .from("payments")
    .update({
      invoice_id: formData.invoice_id,
      amount: formData.amount,
      payment_date: formData.payment_date.toISOString().split("T")[0],
      payment_method: formData.payment_method,
      notes: formData.notes,
    })
    .eq("id", paymentId)

  if (updateError) throw new Error(updateError.message)

  // Si la facture a changé, recalculer pour l’ancienne facture
  if (formData.invoice_id !== currentPayment.invoice_id) {
    const { data: oldPayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("invoice_id", currentPayment.invoice_id)

    const oldTotalPaid = oldPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    if (oldTotalPaid < currentPayment.invoices.total) {
      await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", currentPayment.invoice_id)
    }
  }

  // Vérifier si la nouvelle facture est payée
  const [{ data: newPayments }, { data: selectedInvoice }] = await Promise.all([
    supabase.from("payments").select("amount").eq("invoice_id", formData.invoice_id),
    supabase.from("invoices").select("total").eq("id", formData.invoice_id).single(),
  ])

  if (selectedInvoice) {
    const newTotalPaid = newPayments?.reduce((sum, p) => sum + p.amount, 0) || 0
    const newStatus = newTotalPaid >= selectedInvoice.total ? "paid" : "sent"

    await supabase
      .from("invoices")
      .update({ status: newStatus })
      .eq("id", formData.invoice_id)
  }
}
