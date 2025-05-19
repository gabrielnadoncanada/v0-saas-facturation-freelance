import { getSessionUser } from '@/shared/utils/getSessionUser'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function createPayment(formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser()

  // 1. Vérifier que la facture appartient bien à l'utilisateur
  const res = await supabase
    .from("invoices")
    .select("*")
    .eq("id", formData.invoice_id)
    .single()
  const invoice = extractDataOrThrow<Invoice>(res)
  if (invoice.user_id !== user.id) throw new Error("Facture non trouvée ou non autorisée")

  // 2. Créer le paiement
  const { error: createError } = await supabase.from("payments").insert({
    invoice_id: formData.invoice_id,
    amount: formData.amount,
    payment_date: formData.payment_date.toISOString().split("T")[0],
    payment_method: formData.payment_method,
    notes: formData.notes,
  })
  if (createError) throw new Error(createError.message)

  // 3. Calculer le total payé avec une seule requête SQL (fonction RPC Supabase)
  const { data: sumData, error: sumError } = await supabase
    .rpc("sum_payments_by_invoice", { invoiceid: formData.invoice_id })
  if (sumError) throw new Error(sumError.message)
  const totalPaid = sumData ?? 0

  // 4. Si la facture est payée, update le statut en "paid" (sinon ne fais rien)
  if (totalPaid >= Number(invoice.total)) {
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", formData.invoice_id)
    if (updateError) throw new Error(updateError.message)
  }
}
