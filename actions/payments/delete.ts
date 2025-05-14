"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { PaymentActionResult } from '@/types/payments/payment';

export async function deletePaymentAction(paymentId: string): Promise<PaymentActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer les détails du paiement
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("*, invoices(id, total, user_id)")
        .eq("id", paymentId)
        .single();
    if (paymentError || !payment || payment.invoices.user_id !== session.user.id) {
        return { success: false, error: "Paiement non trouvé" };
    }
    // Supprimer le paiement
    const { error: deleteError } = await supabase.from("payments").delete().eq("id", paymentId);
    if (deleteError) {
        return { success: false, error: deleteError.message };
    }
    // Vérifier les paiements restants pour la facture
    const { data: remainingPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", payment.invoice_id);
    const totalPaid = remainingPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    // Mettre à jour le statut de la facture si nécessaire
    if (totalPaid < payment.invoices.total) {
        await supabase.from("invoices").update({ status: "sent" }).eq("id", payment.invoice_id);
    }
    revalidatePath("/dashboard/payments");
    return { success: true };
} 