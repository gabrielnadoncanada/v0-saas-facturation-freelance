import { getSessionUser } from '@/shared/utils/getSessionUser'
import { PaymentFormData } from '@/shared/types/payments/payment'

export async function createPaymentInDb(formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // Vérifier que la facture appartient bien à l'utilisateur
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id, total, user_id")
    .eq("id", formData.invoice_id)
    .single()

  if (invoiceError || !invoice || invoice.user_id !== user.id) {
    throw new Error("Facture non trouvée ou non autorisée")
  }

  // Créer le paiement
  const { error: createError } = await supabase.from("payments").insert({
    invoice_id: formData.invoice_id,
    amount: formData.amount,
    payment_date: formData.payment_date.toISOString().split("T")[0],
    payment_method: formData.payment_method,
    notes: formData.notes,
  })

  if (createError) {
    throw new Error(createError.message)
  }

  // Vérifier si la facture est maintenant complètement payée
  const { data: invoicePayments, error: paymentError } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", formData.invoice_id)

  if (paymentError) {
    throw new Error(paymentError.message)
  }

  const totalPaid = invoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0

  if (totalPaid >= invoice.total) {
    await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", formData.invoice_id)
  }
}
