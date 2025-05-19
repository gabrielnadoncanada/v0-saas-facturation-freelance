import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Payment, PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function updatePayment(paymentId: string, formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // 1. Récupérer le paiement courant + la facture d'origine
  const res = await supabase
    .from("payments")
    .select("id, invoice_id, amount, invoice:invoices(id, total, user_id)")
    .eq("id", paymentId)
    .single()
  const currentPayment = extractDataOrThrow<any>(res)

  if (!currentPayment.invoice || currentPayment.invoice.user_id !== user.id) {
    throw new Error("Paiement non trouvé ou non autorisé")
  }

  // 2. Mettre à jour le paiement
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

  // 3. Si la facture a changé, recalculer l'ancienne facture (statut)
  if (formData.invoice_id !== currentPayment.invoice_id) {
    const { data: oldSum, error: oldSumError } = await supabase
      .rpc("sum_payments_by_invoice", { invoiceid: currentPayment.invoice_id })
    if (oldSumError) throw new Error(oldSumError.message)

    if ((oldSum ?? 0) < Number(currentPayment.invoice.total)) {
      await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", currentPayment.invoice_id)
    }
  }

  // 4. Vérifier la nouvelle facture (statut paid/sent)
  const [{ data: newSum, error: newSumError }, { data: selectedInvoice, error: selectedInvoiceError }] = await Promise.all([
    supabase.rpc("sum_payments_by_invoice", { invoiceid: formData.invoice_id }),
    supabase.from("invoices").select("total").eq("id", formData.invoice_id).single(),
  ])
  if (newSumError) throw new Error(newSumError.message)
  if (selectedInvoiceError) throw new Error(selectedInvoiceError.message)

  if (selectedInvoice) {
    const newTotalPaid = newSum ?? 0
    const newStatus = newTotalPaid >= Number(selectedInvoice.total) ? "paid" : "sent"

    await supabase
      .from("invoices")
      .update({ status: newStatus })
      .eq("id", formData.invoice_id)
  }
}
