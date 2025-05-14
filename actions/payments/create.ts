"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { PaymentFormData, PaymentActionResult } from '@/types/payments/payment';

export async function createPaymentAction(formData: PaymentFormData): Promise<PaymentActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Vérifier que la facture existe et appartient à l'utilisateur
    const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select("id, total, user_id")
        .eq("id", formData.invoice_id)
        .single();
    if (invoiceError || !invoice || invoice.user_id !== session.user.id) {
        return { success: false, error: "Facture non trouvée" };
    }
    // Créer le paiement
    const { error: createError } = await supabase.from("payments").insert({
        invoice_id: formData.invoice_id,
        amount: formData.amount,
        payment_date: formData.payment_date.toISOString().split("T")[0],
        payment_method: formData.payment_method,
        notes: formData.notes,
    });
    if (createError) {
        return { success: false, error: createError.message };
    }
    // Vérifier si le paiement couvre le montant total de la facture
    const { data: invoicePayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", formData.invoice_id);
    const totalPaid = invoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    // Mettre à jour le statut de la facture si nécessaire
    if (totalPaid >= invoice.total) {
        await supabase.from("invoices").update({ status: "paid" }).eq("id", formData.invoice_id);
    }
    revalidatePath("/dashboard/payments");
    return { success: true };
} 