import { getSessionUser } from '@/shared/utils/getSessionUser';
import { PaymentFormData } from '@/features/payment/shared/types/payment.types';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { fetchById, insertRecord, updateRecord } from '@/shared/services/supabase/crud';

export async function createPayment(formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser();

  // 1. Vérifier que la facture appartient bien à l'utilisateur
  const invoice = await fetchById<Invoice>(supabase, 'invoices', formData.invoice_id, '*', {
    user_id: user.id,
  });

  // 2. Créer le paiement
  await insertRecord(supabase, 'payments', {
    invoice_id: formData.invoice_id,
    amount: formData.amount,
    payment_date: formData.payment_date.toISOString().split('T')[0],
    payment_method: formData.payment_method,
    notes: formData.notes,
  });

  // 3. Calculer le total payé avec une seule requête SQL (fonction RPC Supabase)
  const { data: sumData, error: sumError } = await supabase.rpc('sum_payments_by_invoice', {
    invoiceid: formData.invoice_id,
  });
  if (sumError) throw new Error(sumError.message);
  const totalPaid = sumData ?? 0;

  // 4. Si la facture est payée, update le statut en "paid" (sinon ne fais rien)
  if (totalPaid >= Number(invoice.total)) {
    await updateRecord(supabase, 'invoices', formData.invoice_id, { status: 'paid' });
  }
}
