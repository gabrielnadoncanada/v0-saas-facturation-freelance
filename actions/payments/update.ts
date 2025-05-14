"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { PaymentFormData, PaymentActionResult } from '@/types/payments/payment';

export async function updatePaymentAction(paymentId: string, formData: PaymentFormData): Promise<PaymentActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer les détails du paiement actuel
    const { data: currentPayment } = await supabase
        .from("payments")
        .select("*, invoices(id, total, user_id)")
        .eq("id", paymentId)
        .single();
    if (!currentPayment || currentPayment.invoices.user_id !== session.user.id) {
        return { success: false, error: "Paiement non trouvé" };
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
        .eq("id", paymentId);
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    // Si la facture a changé, vérifier les statuts des deux factures
    if (formData.invoice_id !== currentPayment.invoice_id) {
        // Vérifier les paiements pour l'ancienne facture
        const { data: oldInvoicePayments } = await supabase
            .from("payments")
            .select("amount")
            .eq("invoice_id", currentPayment.invoice_id);
        const oldTotalPaid = oldInvoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        // Mettre à jour le statut de l'ancienne facture si nécessaire
        if (oldTotalPaid < currentPayment.invoices.total) {
            await supabase.from("invoices").update({ status: "sent" }).eq("id", currentPayment.invoice_id);
        }
    }
    // Vérifier si le paiement couvre le montant total de la nouvelle facture
    const { data: newInvoicePayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", formData.invoice_id);
    const { data: selectedInvoice } = await supabase
        .from("invoices")
        .select("total")
        .eq("id", formData.invoice_id)
        .single();
    if (selectedInvoice) {
        const newTotalPaid = newInvoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        if (newTotalPaid >= selectedInvoice.total) {
            await supabase.from("invoices").update({ status: "paid" }).eq("id", formData.invoice_id);
        } else {
            await supabase.from("invoices").update({ status: "sent" }).eq("id", formData.invoice_id);
        }
    }
    revalidatePath("/dashboard/payments");
    return { success: true };
} 