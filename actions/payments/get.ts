"use server"
import { createClient } from '@/lib/supabase/server';
import { Payment, PaymentActionResult } from '@/types/payments/payment';

export async function getPaymentAction(paymentId: string): Promise<PaymentActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer les détails du paiement
    const { data: rawPayment, error: paymentError } = await supabase
        .from("payments")
        .select("*, invoices(id, invoice_number, client_id, total, user_id, clients(name))")
        .eq("id", paymentId)
        .single();
    if (paymentError || !rawPayment || rawPayment.invoices.user_id !== session.user.id) {
        return { success: false, error: "Paiement non trouvé" };
    }
    // Aplatir les champs nécessaires
    const payment = {
        ...rawPayment,
        invoice_number: rawPayment.invoices?.invoice_number,
        client_name: rawPayment.invoices?.clients?.name,
    };
    // Récupérer la liste des factures pour le sélecteur
    const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select("id, invoice_number, client_id, total, clients(name)")
        .eq("user_id", session.user.id)
        .or(`status.eq.sent,id.eq.${payment.invoice_id}`)
        .order("due_date", { ascending: false });
    if (invoicesError) {
        return { success: false, error: "Erreur lors de la récupération des factures" };
    }
    return { success: true, error: undefined, data: { payment, invoices: invoices || [] } };
} 