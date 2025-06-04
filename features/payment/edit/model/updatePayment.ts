import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Payment, PaymentFormData } from '@/features/payment/shared/types/payment.types';
import { fetchById, updateRecord } from '@/shared/services/supabase/crud';

export async function updatePayment(paymentId: string, formData: PaymentFormData): Promise<void> {
  const { supabase, user } = await getSessionUser();

  // 1. Récupérer le paiement courant + la facture d'origine
  const currentPayment = await fetchById<{
    id: string;
    invoice_id: string;
    amount: number;
    invoice: { id: string; total: number; user_id: string };
  }>(
    supabase,
    'payments',
    paymentId,
    'id, invoice_id, amount, invoice:invoices(id, total, user_id)',
  );

  if (!currentPayment.invoice || currentPayment.invoice.user_id !== user.id) {
    throw new Error('Paiement non trouvé ou non autorisé');
  }

  // 2. Mettre à jour le paiement
  await updateRecord(supabase, 'payments', paymentId, {
    invoice_id: formData.invoice_id,
    amount: formData.amount,
    payment_date: formData.payment_date.toISOString().split('T')[0],
    payment_method: formData.payment_method,
    notes: formData.notes,
  });

  // 3. Si la facture a changé, recalculer l'ancienne facture (statut)
  if (formData.invoice_id !== currentPayment.invoice_id) {
    const { data: oldSum, error: oldSumError } = await supabase.rpc('sum_payments_by_invoice', {
      invoiceid: currentPayment.invoice_id,
    });
    if (oldSumError) throw new Error(oldSumError.message);

    if ((oldSum ?? 0) < Number(currentPayment.invoice.total)) {
      await updateRecord(supabase, 'invoices', currentPayment.invoice_id, { status: 'sent' });
    }
  }

  // 4. Recalculer la nouvelle facture
  const { data: newSum, error: newSumError } = await supabase.rpc('sum_payments_by_invoice', {
    invoiceid: formData.invoice_id,
  });
  if (newSumError) throw new Error(newSumError.message);

  // 5. Vérifier si on doit actualiser le statut de la nouvelle facture
  const newInvoice = await fetchById<{ total: number }>(
    supabase,
    'invoices',
    formData.invoice_id,
    'total',
  );

  if ((newSum ?? 0) >= Number(newInvoice.total)) {
    await updateRecord(supabase, 'invoices', formData.invoice_id, { status: 'paid' });
  }
}
